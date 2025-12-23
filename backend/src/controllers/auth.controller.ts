import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';

// Mock admin user for demo mode when MongoDB is not available
const mockAdminUser = {
    _id: 'mock-admin-id',
    email: config.admin.email,
    password: config.admin.password,
    name: 'Admin',
    role: 'admin' as const,
};

// Generate tokens
const generateTokens = (user: IUser) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
};

// Register
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create user
        const user = await User.create({
            email,
            password,
            name,
            role: 'user',
        });

        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Demo mode login when MongoDB is not connected
        if (!isDBConnected()) {
            console.log('Running in demo mode - using mock authentication');

            // Check mock admin credentials
            if (email === mockAdminUser.email && password === mockAdminUser.password) {
                const accessToken = jwt.sign(
                    { id: mockAdminUser._id, email: mockAdminUser.email, role: mockAdminUser.role },
                    config.jwt.secret,
                    { expiresIn: '1d' } // Longer expiry for demo mode
                );
                const refreshToken = jwt.sign(
                    { id: mockAdminUser._id },
                    config.jwt.refreshSecret,
                    { expiresIn: '7d' }
                );

                res.json({
                    message: 'Login successful (Demo Mode)',
                    user: {
                        id: mockAdminUser._id,
                        email: mockAdminUser.email,
                        name: mockAdminUser.name,
                        role: mockAdminUser.role,
                    },
                    accessToken,
                    refreshToken,
                });
                return;
            }

            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Normal login with MongoDB
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Refresh token
export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            res.status(401).json({ message: 'Refresh token required' });
            return;
        }

        // Verify refresh token
        const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };

        // Find user and check refresh token
        const user = await User.findById(decoded.id).select('+refreshToken');
        if (!user || user.refreshToken !== token) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Update refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

// Logout
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user) {
            await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during logout' });
    }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

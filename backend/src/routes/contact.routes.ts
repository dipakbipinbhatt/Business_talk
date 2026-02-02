import express from 'express';
import ContactMessage from '../models/ContactMessage';
import emailService from '../services/emailService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public route - Submit contact form
router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Save to database
        const contactMessage = new ContactMessage({
            name,
            email,
            message,
            status: 'unread',
        });

        await contactMessage.save();

        // Send email notification to admin (non-blocking)
        emailService.sendContactNotification(name, email, message).catch(err => {
            console.error('Failed to send email notification:', err);
        });

        res.status(201).json({
            message: 'Message sent successfully',
            data: {
                id: contactMessage._id,
                name: contactMessage.name,
                email: contactMessage.email,
                createdAt: contactMessage.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
});

// Admin routes - Protected
router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query: any = {};
        if (status && ['unread', 'read', 'archived'].includes(status as string)) {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [messages, total, unreadCount] = await Promise.all([
            ContactMessage.find(query)
                .sort({ createdAt: -1 })
                .allowDiskUse(true)
                .skip(skip)
                .limit(Number(limit)),
            ContactMessage.countDocuments(query),
            ContactMessage.countDocuments({ status: 'unread' }),
        ]);

        res.json({
            messages,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
            unreadCount,
        });
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
});

// Get single message
router.get('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message });
    } catch (error: any) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Failed to fetch message', error: error.message });
    }
});

// Mark message as read
router.patch('/messages/:id/read', authenticateToken, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            {
                status: 'read',
                readAt: new Date(),
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message marked as read', data: message });
    } catch (error: any) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Failed to update message', error: error.message });
    }
});

// Update message status
router.patch('/messages/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['unread', 'read', 'archived'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updateData: any = { status };
        if (status === 'read') {
            updateData.readAt = new Date();
        }

        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Status updated successfully', data: message });
    } catch (error: any) {
        console.error('Error updating message status:', error);
        res.status(500).json({ message: 'Failed to update status', error: error.message });
    }
});

// Delete message
router.delete('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Failed to delete message', error: error.message });
    }
});

// Get statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const [total, unread, read, archived] = await Promise.all([
            ContactMessage.countDocuments(),
            ContactMessage.countDocuments({ status: 'unread' }),
            ContactMessage.countDocuments({ status: 'read' }),
            ContactMessage.countDocuments({ status: 'archived' }),
        ]);

        res.json({
            stats: {
                total,
                unread,
                read,
                archived,
            },
        });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
});

export default router;

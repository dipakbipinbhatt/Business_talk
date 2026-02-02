// Test script to diagnose MongoDB connection and blog operations
import mongoose from 'mongoose';
import { config } from './config/env';
import { Blog } from './models/Blog';

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection and Blog Operations...\n');
    
    try {
        // Test 1: Connect to MongoDB
        console.log('📡 Test 1: Connecting to MongoDB Atlas...');
        console.log('   URI:', config.mongodb.uri.replace(/:[^:@]+@/, ':****@'));
        
        await mongoose.connect(config.mongodb.uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ Connected to MongoDB successfully!\n');
        
        // Test 2: Check database and collections
        console.log('📊 Test 2: Checking database...');
        const db = mongoose.connection.db;
        const collections = await db?.listCollections().toArray();
        console.log('   Database:', mongoose.connection.name);
        console.log('   Collections:', collections?.map(c => c.name).join(', ') || 'None');
        console.log('✅ Database accessible\n');
        
        // Test 3: Count existing blogs
        console.log('📚 Test 3: Counting existing blogs...');
        const blogCount = await Blog.countDocuments();
        console.log('   Total blogs in database:', blogCount);
        
        if (blogCount > 0) {
            const publishedCount = await Blog.countDocuments({ isPublished: true });
            const draftCount = await Blog.countDocuments({ isPublished: false });
            console.log('   Published:', publishedCount);
            console.log('   Drafts:', draftCount);
            
            // Show first 3 blogs
            const blogs = await Blog.find().limit(3).select('title isPublished createdAt');
            console.log('\n   Sample blogs:');
            blogs.forEach((blog, i) => {
                console.log(`   ${i + 1}. ${blog.title} (${blog.isPublished ? 'Published' : 'Draft'})`);
            });
        }
        console.log('✅ Blog count retrieved\n');
        
        // Test 4: Create a test blog
        console.log('📝 Test 4: Creating a test blog...');
        const testBlog = new Blog({
            title: 'Test Blog - Database Connection Test',
            excerpt: 'This is a test blog to verify database connectivity',
            content: 'If you see this blog in your database, the connection is working correctly!',
            author: 'System Test',
            category: 'Test',
            isPublished: false,
        });
        
        await testBlog.save();
        console.log('✅ Test blog created with ID:', testBlog._id);
        console.log('   Title:', testBlog.title);
        console.log('   Created at:', testBlog.createdAt);
        
        // Test 5: Read the test blog back
        console.log('\n📖 Test 5: Reading test blog back...');
        const retrievedBlog = await Blog.findById(testBlog._id);
        if (retrievedBlog) {
            console.log('✅ Test blog retrieved successfully');
            console.log('   ID matches:', retrievedBlog._id.toString() === testBlog._id.toString());
        } else {
            console.log('❌ Failed to retrieve test blog');
        }
        
        // Test 6: Update the test blog
        console.log('\n✏️  Test 6: Updating test blog...');
        retrievedBlog!.title = 'Test Blog - Updated';
        await retrievedBlog!.save();
        const updatedBlog = await Blog.findById(testBlog._id);
        console.log('✅ Test blog updated');
        console.log('   New title:', updatedBlog?.title);
        
        // Test 7: Delete the test blog
        console.log('\n🗑️  Test 7: Deleting test blog...');
        await Blog.findByIdAndDelete(testBlog._id);
        const deletedBlog = await Blog.findById(testBlog._id);
        if (!deletedBlog) {
            console.log('✅ Test blog deleted successfully');
        } else {
            console.log('❌ Failed to delete test blog');
        }
        
        // Final summary
        console.log('\n' + '='.repeat(50));
        console.log('🎉 ALL TESTS PASSED!');
        console.log('='.repeat(50));
        console.log('\n✅ MongoDB connection is working correctly');
        console.log('✅ Blog model operations (Create, Read, Update, Delete) are working');
        console.log('✅ Database:', mongoose.connection.name);
        console.log('✅ Host:', mongoose.connection.host);
        console.log('\n💡 If you\'re still having issues:');
        console.log('   1. Check your MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)');
        console.log('   2. Verify your MongoDB user has read/write permissions');
        console.log('   3. Check if your backend server is running (npm run dev)');
        console.log('   4. Verify the frontend API URL is correct');
        
    } catch (error: any) {
        console.error('\n❌ ERROR OCCURRED:');
        console.error('   Message:', error.message);
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
            console.error('\n🔧 NETWORK ERROR:');
            console.error('   - Check your internet connection');
            console.error('   - Verify MongoDB Atlas cluster is running');
            console.error('   - Check if IP is whitelisted in MongoDB Atlas');
        } else if (error.message.includes('authentication failed')) {
            console.error('\n🔧 AUTHENTICATION ERROR:');
            console.error('   - Check MongoDB username and password in .env');
            console.error('   - Verify user has correct permissions');
        } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.error('\n🔧 SSL/TLS ERROR:');
            console.error('   - Try using Node.js v20 instead of v24');
            console.error('   - Update your connection string');
        }
        
        console.error('\n📋 Full error details:');
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Connection closed');
        process.exit(0);
    }
}

// Run the test
testConnection();


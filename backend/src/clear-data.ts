import { connectDB } from './config/db';
import { User } from './models/User';
import { Podcast } from './models/Podcast';
import { Blog } from './models/Blog';
import { Category } from './models/Category';

const clearAllData = async () => {
    try {
        await connectDB();
        console.log('🗑️  Starting to clear all data...');

        // Clear all collections
        const podcastsDeleted = await Podcast.deleteMany({});
        console.log(`✅ Deleted ${podcastsDeleted.deletedCount} podcasts`);

        const blogsDeleted = await Blog.deleteMany({});
        console.log(`✅ Deleted ${blogsDeleted.deletedCount} blogs`);

        const categoriesDeleted = await Category.deleteMany({});
        console.log(`✅ Deleted ${categoriesDeleted.deletedCount} categories`);

        const usersDeleted = await User.deleteMany({});
        console.log(`✅ Deleted ${usersDeleted.deletedCount} users`);

        console.log('\n🎉 All data cleared successfully!');
        console.log('📊 Database tables are intact and empty');
        console.log('\n⚠️  Note: You may want to create a new admin user to access the admin panel');

        process.exit(0);
    } catch (error) {
        console.error('❌ Clear data error:', error);
        process.exit(1);
    }
};

clearAllData();


@echo off
echo ========================================
echo FIXING ALL PODCAST IMAGES
echo ========================================
echo.

cd /d "%~dp0backend"

echo Running fix script...
node -e "const mongoose = require('mongoose'); const uri = process.env.MONGODB_URI || 'your-mongodb-uri'; mongoose.connect(uri).then(async () => { const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false })); const podcasts = await Podcast.find({ category: 'upcoming' }); console.log('Found ' + podcasts.length + ' upcoming podcasts'); let fixed = 0; for (const p of podcasts) { if (!p.thumbnailImage && p.guestImage) { p.thumbnailImage = p.guestImage; await p.save(); console.log('Fixed: ' + p.title); fixed++; } } console.log('Fixed ' + fixed + ' podcasts'); await mongoose.disconnect(); }).catch(e => console.error(e));"

echo.
echo ========================================
echo DONE! Now refresh your browser.
echo ========================================
pause

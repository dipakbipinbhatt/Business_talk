const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'logo', 'bannner.png');
const dest = path.join(__dirname, 'frontend', 'public', 'banner.png');

try {
    fs.copyFileSync(source, dest);
    console.log('Banner copied successfully!');
} catch (error) {
    console.error('Error copying banner:', error);
    process.exit(1);
}

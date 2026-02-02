const http = require('http');

console.log('Fetching Render config from http://localhost:5000/api/render/config...');

http.get('http://localhost:5000/api/render/config', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response body:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});

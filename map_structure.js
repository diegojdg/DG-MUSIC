const fs = require('fs');
const lines = fs.readFileSync('DGMUSIC/index.html', 'utf8').split('\r\n');
const out = [];
lines.forEach((l, i) => {
    if (l.match(/^\s+<!--\s|<section|<\/section|id="|id='/i) || l.includes('mp4') || l.includes('lazy-video') || l.includes('lazyVideo') || l.includes('modal-video') || l.includes('video-modal')) {
        out.push(`${i+1}: ${l.trim()}`);
    }
});
fs.writeFileSync('structure_map.txt', out.join('\n'), 'utf8');
console.log('Done, lines:', lines.length);


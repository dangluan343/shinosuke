const fs = require('fs');
const path = require('path');
const https = require('https');

const files = [
  { name: 'home.html', prefix: 'home' },
  { name: 'squad.html', prefix: 'squad' },
  { name: 'gallery.html', prefix: 'gallery' },
  { name: 'city.html', prefix: 'city' }
];

const exportDir = path.join(__dirname, '..', 'stitch-export');
const outputDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function extractImages() {
  const list = [];
  const seenSrc = new Set();

  for (const f of files) {
    const filePath = path.join(exportDir, f.name);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');

    // Match all img tags
    const imgMatches = content.match(/<img[^>]+>/g) || [];
    let count = 0;

    for (const tag of imgMatches) {
      const srcMatch = tag.match(/src="([^"]+)"/);
      const altMatch = tag.match(/data-alt="([^"]*)"/) || tag.match(/alt="([^"]*)"/);

      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        if (!seenSrc.has(src)) {
          seenSrc.add(src);
          count++;
          const alt = altMatch ? altMatch[1] : '';
          
          // Generate a clean filename based on alt or prefix
          let slug = alt
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 30);
          
          if (!slug) slug = `image-${count}`;
          const filename = `${f.prefix}-${count}-${slug}.jpg`;

          list.push({
            page: f.prefix,
            filename,
            src,
            alt
          });
        }
      }
    }
  }
  return list;
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const images = extractImages();
  console.log(`Found ${images.length} unique images to download:`);
  images.forEach(img => console.log(` - [${img.page}] ${img.filename} -> ${img.src.substring(0, 60)}...`));

  console.log('\nStarting download to public/images/...');
  for (const img of images) {
    const dest = path.join(outputDir, img.filename);
    try {
      await downloadImage(img.src, dest);
      const stat = fs.statSync(dest);
      console.log(`✓ Downloaded ${img.filename} (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`✗ Error downloading ${img.filename}:`, e.message);
    }
  }

  // Save asset manifest JSON
  const manifestPath = path.join(__dirname, '..', 'public', 'images', 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2), 'utf8');
  console.log(`\nSaved manifest to ${manifestPath}`);
}

main();


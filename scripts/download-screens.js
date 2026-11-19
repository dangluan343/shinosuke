const fs = require('fs');
const path = require('path');
const { callStitch } = require('./stitch-cli');

const PROJECT_ID = 'projects/13757066292734691956';

const screens = [
  { id: '576c8d027bca4896a929887be3efc495', title: 'home', file: `projects/13757066292734691956/files/576c8d027bca4896a929887be3efc495` },
  { id: '3e02720b6b4047d3b31cb1de474c71a8', title: 'squad', file: `projects/13757066292734691956/files/3e02720b6b4047d3b31cb1de474c71a8` },
  { id: 'f404a0565ce6481bae8c4cd4d8b76a9d', title: 'gallery', file: `projects/13757066292734691956/files/f404a0565ce6481bae8c4cd4d8b76a9d` },
  { id: 'ef81d7103fc54402b4c2570185e7563c', title: 'city', file: `projects/13757066292734691956/files/ef81d7103fc54402b4c2570185e7563c` },
];

async function run() {
  const outDir = path.join(__dirname, '..', 'stitch-export');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const s of screens) {
    console.log(`Downloading ${s.title} (${s.file})...`);
    try {
      const res = await callStitch('tools/call', {
        name: 'download_file',
        arguments: { name: s.file }
      });
      
      let html = '';
      if (res.structuredContent && res.structuredContent.html) {
        html = res.structuredContent.html;
      } else if (res.content && res.content[0] && res.content[0].text) {
        try {
          const parsed = JSON.parse(res.content[0].text);
          html = parsed.html || res.content[0].text;
        } catch(e) {
          html = res.content[0].text;
        }
      }
      
      const outPath = path.join(outDir, `${s.title}.html`);
      fs.writeFileSync(outPath, html, 'utf8');
      console.log(`Saved to ${outPath} (${html.length} chars)`);
    } catch (err) {
      console.error(`Failed to download ${s.title}:`, err.message);
    }
  }
}

run();


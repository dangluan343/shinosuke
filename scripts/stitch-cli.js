const https = require('https');

const API_KEY = process.env.STITCH_API_KEY || '';

function callStitch(method, params = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      id: Date.now(),
      params: params
    });

    const options = {
      hostname: 'stitch.googleapis.com',
      port: 443,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) {
            reject(new Error(json.error.message || JSON.stringify(json.error)));
          } else {
            resolve(json.result);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const cmd = process.argv[2] || 'tools';

  if (cmd === 'tools') {
    const res = await callStitch('tools/list');
    console.log('Available Stitch Tools:');
    res.tools.forEach(t => console.log(` - ${t.name}: ${t.description.split('\n')[0]}`));
  } else if (cmd === 'call') {
    const toolName = process.argv[3];
    const argsJson = process.argv[4] ? JSON.parse(process.argv[4]) : {};
    const res = await callStitch('tools/call', { name: toolName, arguments: argsJson });
    console.log(JSON.stringify(res, null, 2));
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { callStitch };


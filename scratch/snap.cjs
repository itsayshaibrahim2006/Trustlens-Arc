const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9340',
  '--window-size=1440,1200',
  '--disable-gpu',
  'http://localhost:5173'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9340/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const tab = tabs.find(t => t.url.includes('5173'));
      if (!tab) { chrome.kill(); return; }
      const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 2,
            method: 'Runtime.evaluate',
            params: { expression: 'document.getElementById("deepfakes-section").scrollIntoView();' }
          }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 1500);
        }, 1500);
      };
      ws.onmessage = (msg) => {
        const payload = JSON.parse(msg.data);
        if (payload.id === 3 && payload.result?.data) {
          fs.writeFileSync('scratch/deepfakes_exact.png', Buffer.from(payload.result.data, 'base64'));
          console.log('EXACT DEEPFAKES SECTION SCREENSHOT SAVED');
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2500);

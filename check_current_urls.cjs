const fs = require('fs');
const https = require('https');
const urls = fs.readFileSync('urls.txt', 'utf8').split('\n').filter(Boolean);

async function checkUrls() {
  for (const url of urls) {
    try {
      await new Promise((resolve) => {
        https.get(url, (res) => {
          if (res.statusCode !== 200 && res.statusCode !== 302) { 
             console.log(`${res.statusCode} - ${url}`);
          }
          res.resume(); // consume response data to free up memory
          resolve();
        }).on('error', (e) => {
          console.error(`Error with ${url}: ${e.message}`);
          resolve();
        });
      });
    } catch (e) { 
       console.error(`Fetch error ${url}`);
    }
  }
  console.log("Done");
}
checkUrls();

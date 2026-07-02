const fs = require('fs');
const https = require('https');

const urls = [
'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop',
'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=400&auto=format&fit=crop',
'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop',
'https://images.unsplash.com/photo-1508514177221-188b1cc92444?q=80&w=1200&auto=format&fit=crop',
'https://images.unsplash.com/photo-1508514177221-188b1cc92444?q=80&w=400&auto=format&fit=crop',
'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=400&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2500&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581092334812-78d10336214d?q=80&w=800&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2500&auto=format&fit=crop',
'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop',
'https://images.unsplash.com/photo-1588693959146-81cf94e9f506?q=80&w=800&auto=format&fit=crop',
'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1200&auto=format&fit=crop',
'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=400&auto=format&fit=crop',
'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop'
];

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

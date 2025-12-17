const https = require('https');

const API_KEY = 'IST.eyJraWQiOiJQb3pIRVhKMCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjI0MjUyNzVhLTAzZTEtNDljZi05NjZmLTE4NWUxZTI2NjRkNFwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjhjY2VhMzllLTkwYjItNGI2MC04Njk5LWVjYWY3OTAyYjU1NFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIyZTU5OTRmOS1lN2ExLTQ5MDMtYjc5OS1mNzYxMWI0MWY0YTBcIn19IiwiaWF0IjoxNzMzODc0NDMyfQ.WmLijlRJfubuFJl9pSjrT_fwUYCFfLg2e1H25xyxfRjSVOcZfC8f2vfx6Mh2hBs1INgPWm3cSvr2H_rE-yjWdcjdcqMDnQnJllfJV3mCxqB5_vLcw_YU24ZO1CPZOU-69FUDVxrqyYrFvDPbOqn0y8MBDy4nRLUHPTnf8SMCa8-Lhaw0c2TgIEXONAomJJjhqLCKkijPnPgS5NjRE3m8h-X3YZRMmHlpgMTGOYmWBSLq9oU-0zKTBVGCqO2hLeCIKYHfMTpTDFQSUqPR4bQOm-_LiqaVLAx8-deSiuJl3WglkIdBLO3Ueq0MAxNPnuFiwRXlL4T-Lhj2yT1FaL2DYA';
const SITE_ID = '55a0675b-c25e-4c1b-a931-415cf2f09992';

const postData = JSON.stringify({
  query: { paging: { limit: 100 } }
});

const options = {
  hostname: 'www.wixapis.com',
  port: 443,
  path: '/stores/v1/products/query',
  method: 'POST',
  headers: {
    'Authorization': API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const fs = require('fs');
    fs.writeFileSync('store-products.json', data);
    const parsed = JSON.parse(data);
    console.log('Products saved:', parsed.products?.length || 0);
  });
});

req.on('error', (e) => { console.error('Error:', e.message); });
req.write(postData);
req.end();

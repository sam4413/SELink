const request = require('request'); // You can use your preferred HTTP request library
require('dotenv').config();
const JSONbig = require('json-bigint');
const notify = require('../notify');
const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`;


// Define your array of IDs
const ids = [
  75382010718513655, 76579092782700005, 97857803110367414, 86988650239273118, 136474389055645914,
  98479563687527796, 93229976030635340, 133019453827259469, 142039477707042065, 79266694130888958,
  94174288011308588, 76544631311413460, 127682071478584745, 82062524908008928, 129745462257169746,
  84593430790711674, 101981497781143868, 103520753284076427, 84085516718268710, 113049993598485310,
  83736316096673722, 113127627597915562, 130809910008349820, 112554926753894630, 139351966266662485,
  94072661220862154, 125700743094072940, 116088014669415121,
];

const batchSize = 10;
const delayBetweenBatches = 5000; // 5 seconds in milliseconds

function performBatchRequests(ids) {
  if (ids.length === 0) {
    // All requests have been completed
    console.log('All requests completed.');
    return;
  }

  const batch = ids.slice(0, batchSize);
  ids = ids.slice(batchSize);


  
  // Perform requests for the current batch
  batch.forEach(id => {

    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${id}`,
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    

    // Replace this with your actual request logic
    request.get(options, (error, response, body) => {
        
      if (response.statusCode == 401) {
        notify.notify(3, "Error accessing remote data.");
      } else if (response.statusCode != 200) {
        notify.notify(3, `Error accessing remote data with a status code of ${response.statusCode}.`);
      } else {
        notify.notify(2,`Response for ID ${id}: ${body}`);
      }
    });
  });

  // Wait for the specified delay before making the next batch of requests
  setTimeout(() => {
    notify.notify(3,"==================== WAITING ====================")
    performBatchRequests(ids);
  }, delayBetweenBatches);
}

// Start the process
performBatchRequests(ids);
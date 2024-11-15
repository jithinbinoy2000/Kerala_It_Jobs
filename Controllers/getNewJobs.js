const axios = require('axios');
const https = require('https');
const { extractDatas } = require('../Extractor/dataExtractor');
const cron = require('node-cron')

const agent = new https.Agent({  
    rejectUnauthorized: false
});

exports.getAllJobs = async (request, response) => {
    try {
         const apiResponse = await axios.get(process.env.SCRAP_WEBSITE_URL1, { httpsAgent: agent });
          await extractDatas(apiResponse.data)
        
        response.status(200).json({data:apiResponse.data})
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: error.message });
    }
};
cron.schedule('* * * * *', async () => {
    console.log('Fetching new jobs every 6 hours...');
    await this.getAllJobs()
  });
  
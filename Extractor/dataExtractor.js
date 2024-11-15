const jsdom = require('jsdom');
const Job = require('../Schemas/jobsSchema');
const User = require('../Schemas/userSchema');
const { notifyByEmail } = require('../Setups/sendEmail');
const { JSDOM } = jsdom;
const categories = {
  "FullStack": ["react", "angular", "nodejs", "node", "mongodb", "javascript", "mearn", "mean"],
  "Flutter": ["flutter", "dart"],
  "Python": ["python", "django", "flask"],
  "DataScience": ["data science", "machine learning", "deep learning", "data analyst", "data engineer"],
  "Testing": ["testing", "qa", "quality assurance", "selenium", "test automation"],
  "Java": ["java", "spring", "spring boot", "j2ee", "hibernate"]
};


exports.extractDatas = async (webContent) => {
  const { document } = new JSDOM(webContent).window;
    document.querySelectorAll('.company-list').forEach(async (jobElement) => {
    const jobTitle = jobElement.querySelector('a').textContent.trim();
    const companyName = jobElement.querySelector('.jobs-comp-name').textContent.trim();
    const jobDate = jobElement.querySelector('.job-date').textContent.trim();
    const jobLink = jobElement.querySelector("a").getAttribute('href');
    const jobId = jobLink.split("company-jobs/")[1];

   
    let matchedCategory = null;
    for (const [category, keywords] of Object.entries(categories)) {
      const isMatch = keywords.some(keyword => jobTitle.toLowerCase().includes(keyword));
      if (isMatch) {
        matchedCategory = category;
        break; 
      }
    }

    if (matchedCategory) {
      try {
        
        const existingJob = await Job.findOne({ jobId:jobId });

        
        if (!existingJob) {
          const newJob = new Job({
            jobId: jobId,
            jobTitle: jobTitle,
            companyName: companyName,
            jobDate: jobDate,
            jobLink: jobLink,
            category: matchedCategory.replace("/", "_"),
            isJobNew:true
          });

          await newJob.save();
          
          
          console.log(`Saved new job in category ${matchedCategory}: ${jobTitle}`);
        } else {
          console.log(existingJob);
          console.log(`Job already exists in category ${matchedCategory}: ${jobTitle}`);
        }
      } catch (error) {
        console.error(`Error saving job: ${error.message}`);
      }
    }
  });
};
const getNewJobs = async (category) => {
  try {
    const newJobs = await Job.find({
      category: category,
      isJobNew: true
    });
    return newJobs;
  } catch (error) {
    console.error(`Error fetching new jobs for category ${category}:`, error);
    return [];
  }
};

const getEmailUpdated = async () => {
  const categoryKeys = Object.keys(categories); 
  
  for (const category of categoryKeys) {
    try {
     
      const newJobs = await getNewJobs(category);

      if (newJobs.length > 0) {
        const allUsersByCategory = await User.find({
          category: category,
          notificationStatus: true,
        });
        allUsersByCategory.forEach((user) => {
          notifyByEmail(newJobs, category, user.userEmail);
        });

      } else {
        console.log(`No new jobs in category ${category}, skipping notifications.`);
      }

    } catch (error) {
      console.error(`Error processing users for category ${category}:`, error);
    }
  }
};



getEmailUpdated();

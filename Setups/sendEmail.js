
const nodemailer = require('nodemailer');
const Job = require('../Schemas/jobsSchema');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS
    }
  });
  const generateEmailHtml = (jobs) => {
    let rows = jobs.map(job => `
      <tr style="background-color: rgba(0, 123, 255, 0.1);">
        <td style="padding: 8px; text-align: left;">${job.jobTitle}</td>
        <td style="padding: 8px; text-align: left;">${job.companyName}</td>
        <td style="padding: 8px; text-align: left;">
          <a href="${job.jobLink}" class="btn-primary" style="color: #fff; background-color: #28a745; border: 1px solid #28a745; padding: 0.375rem 0.75rem; font-size: 1rem; text-decoration: none; border-radius: 0.25rem;">
            Apply
          </a>
        </td>
      </tr>
    `).join('');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Job Portal</title>
          <style>
              body {
                  background-color: #e0e0e062;
                  font-family: Arial, sans-serif;
                  width: 100vw;
              }
              .header {
                  background-color: #00e1ff;
                  color: white;
                  padding: 5px;
                  text-align: center;
                  border: transparent;
                  border-radius: 18px 18px 0px 0px;
              }
              .table-container {
                  overflow-x: auto;
              }
              .rounded-table {
                  border: 1px solid #dee2e6;
                  border-radius: 15px;
                  overflow: hidden;
                  width: 100%;
                  border-collapse: separate;
              }
              .rounded-table thead {
                  border-bottom: 2px solid #dee2e6;
                  background-color: #ed8686;
                  color: #000000;
              }
              .rounded-table th, .rounded-table td {
                  border: none;
                  padding: 8px;
                  text-align: left;
              }
              .btn-primary {
                  display: inline-block;
                  font-weight: 400;
                  color: #fff;
                  text-align: center;
                  vertical-align: middle;
                  user-select: none;
                  background-color: #28a745;
                  border: 1px solid #28a745;
                  padding: 0.375rem 0.75rem;
                  font-size: 1rem;
                  line-height: 1.5;
                  border-radius: 0.25rem;
                  text-decoration: none;
              }
              .text-warning {
                  color: #ffc107 !important;
              }
              .text-danger {
                  color: #ff0019 !important;
                  font-weight: bold;
              }
              .text-success {
                  color: #28a745 !important;
              }
              .btn-outline-warning {
                  border-color: #ffc107;
                  color: #ffc107;
                  padding: 5px 10px;
                  text-decoration: none;
                  display: inline-block;
              }
              .btn {
                  text-align: center;
                  border: solid;
                  border-radius: 8px;
              }
          </style>
      </head>
      <body>
          <div class="container" style="padding: 20px; max-width: 600px; margin: auto;">
              <div class="header">
                  <h3>New Job Opportunities</h3>
              </div>
              <p>Hi,</p>
              <p>We found new job opportunities that match your requirements. Please check them out below:</p>
              <div class="table-container" style="margin-bottom: 20px;">
                  <table class="rounded-table" style="width: 100%; border: 1px solid #dee2e6; border-radius: 15px; overflow: hidden;">
                      <thead style="background-color: #f1f1f1;">
                          <tr>
                              <th scope="col" style="padding: 8px; text-align: left;">Position</th>
                              <th scope="col" style="padding: 8px; text-align: left;">Company Name</th>
                              <th scope="col" style="padding: 8px; text-align: left;">Apply</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${rows}
                      </tbody>
                  </table>
              </div>
              <p class="text-danger" style="color: #dc3545; font-weight:normal;">This is a reminder email only. This application is built using specific keywords. There may be a chance that some jobs are missed, so please also check the website directly.</p>
              <p class="text-danger" style="color: #dc3545; font-weight: normal;">To stop email notifications, please contact the developer or reply to this email.
                  <br>
                  <p>Thank You.</p>
                  <a href="mailto:jithinbinoyp@gmail.com" class="btn-outline-warning btn text-center" style="border-color: #000000; color: #000000; padding: 5px 10px; text-decoration: none; display: inline-block;">Contact Us</a>
              </p>
          </div>
      </body>
      </html>
    `;
  };
  const sendEmail = async (newJobs, category, email) => {
    try {
      const emailHtml = generateEmailHtml(newJobs);
      const mailOption = {
        from: process.env.EMAIL,
        to: email,
        subject: `Find new ${category} Jobs In Kerala`,
        html: emailHtml,
      };
  
      await transporter.sendMail(mailOption); //sending email notification
      await Job.updateMany( //updating newJob = false means is that a new job anymore
        {jobId:{$in:newJobs.map((job)=>job.jobId)}},
        {$set:{isJobNew:false}}
      )
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  };
  
exports.notifyByEmail = (newJobs,category,email)=>{
sendEmail(newJobs,category,email)

}


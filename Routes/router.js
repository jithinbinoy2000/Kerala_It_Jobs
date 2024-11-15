const express = require('express');
const { userRegister, userLogin, getAllUserJobs, 
        getAllUserJobsCategory, updateNotificationStatus,
        updateCategory,
         } = require('../Controllers/userController');
const verifyUser = require('../MiddleWares/userVerify').verifyUser
const { getAllJobs } = require('../Controllers/getNewJobs');

const router = express.Router();

// fetching Datas form Website
router.get("/get-new-jobs",getAllJobs)
router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/getAllUserJobs/:page/:limit',getAllUserJobs);
router.get('/getAllUserJobsCategory/:page/:limit/:category',getAllUserJobsCategory)
router.patch('/updateNotificationStatus',verifyUser,updateNotificationStatus)
router.patch('/updateCategory',verifyUser,updateCategory)

module.exports = router;

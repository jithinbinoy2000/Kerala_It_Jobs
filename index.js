require('dotenv').config();
require('./Connections/dataBaseConnection')
const express = require('express');
const cors = require('cors');
const router = require('./Routes/router')

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);


const port = process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`✅ server running Port : ${port}`); 
})
app.get('/',(req,res)=>{
     res.status(200).json({message:'heiii'})
})
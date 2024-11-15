require('dotenv').config();
require('./Connections/dataBaseConnection')
const express = require('express');
const cros = require('cors');

const app = express();
app.use(cros());
app.use(express.json());



const port = process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`✅ server running Port : ${port}`); 
})
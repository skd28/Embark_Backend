const express = require('express');
const app = express();
const cors = require("cors");
const PORT = 5000;
const connectDb = require('./utils/db')
const routes = require('./routes');
app.use(cors());
app.use(express.json());

app.get('/',(req,res) =>{
    res.send("Server is Running")
})

app.use('/api',routes);



connectDb();


app.listen(PORT,()=>{
    console.log(`Server is Running at PORT : `,PORT)
})




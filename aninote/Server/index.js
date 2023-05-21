const ConnectToMongo = require("./db");
ConnectToMongo;
const express = require('express')
var cors  = require('cors');
const app = express()
const port = 5000


//Available express Enpoints  / Routes 
app.use(cors());
app.use(express.json());



//IMPORTANT!!
//Similar to include thing in django which takes us to other folder from which url of that folder handle things after this url. Like we gave include("shop.urls") then handle urls after /shop in shop area .
// Importing the api data from routes/auth file  and routes/notes file 


app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.listen(port, () => {
  console.log(`AniNote app listening on port ${port}`)
})
const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv');
env.config(); //provides access to file contents

const dbServer = require('./dbServer')

app.use(cors()); //when incoming API call, won't block it and let it through
app.use(express.json()); //send json
app.use(express.urlencoded({ extended : false })); //not sending any form data

/*************** ROUTES ***************/

//create
app.post('/donor', (request,response) => {

    // console.log(request.body)
    const params = request.body;
    const db = dbServer.getDbServerInstance();

    const result = db.insertNewDonor(params);
console.log(result)

    result
    .then(data => response.json({ success : true}))
    .catch(err => console.log(err)) 
})

//read
app.get('/', (request, response) => {
    const db = dbServer.getDbServerInstance();

    const result = db.getAllData();
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'))
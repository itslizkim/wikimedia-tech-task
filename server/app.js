const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv');
env.config(); //provides access to file contents

const dbServer = require('./server')

app.use(cors()); //when incoming API call, won't block it and let it through
app.use(express.json()); //send json
app.use(express.urlencoded({ extended : false })); //not sending any form data

/*************** ROUTES ***************/

//create
app.post('/donors', (request,response) => {
    const { name } = request.body;
    const db = dbServer.getDbServerInstance();

    const result = db.insertNewName(name);
    result
    .then(data => response.json({ success : true}))
    .catch(err => console.log(err));


})

app.listen(process.env.PORT, () => console.log('app is running'))
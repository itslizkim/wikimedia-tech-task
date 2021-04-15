const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

//connecting to mysql database
const con = mysql.createConnection({
    
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});


con.connect((err) =>{
    if(err){
        console.log(err.message);
    };
    // console.log('db ' + con.state);
});

class DbServer {
    static getDbServerInstance(){
        return instance ? instance : new DbServer();
        //is instance already created? if yes, return that instance, otherwise create new instance
    };

    //async await to get data : READ
    async getAllData(){ // async before function: a function always returns a promise. Other values are wrapped in a resolved promise automatically.
        try {
            const response = await new Promise((resolve,reject) => { //Promise is where we handle queries
                //if query is successful, resolve it or reject and catch err
                // The keyword await makes JavaScript wait until that promise settles and returns its result.
                const query = "SELECT * FROM donors;";

                con.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;

        } catch (error){
            console.log(error);
        }
    }

    // Create new Donor
    async insertNewDonor(params){
        const donorInput = Object.values(params)
        
        try{
            const insertId = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO donors (`last_name`, `first_name`, `street_address`, `city`, `state_region`, `country`, `postal_code`, `phone_number`, `email`, `contact_pref`, `donation_amount`, `currency`, `donation_freq`, `comment`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

                con.query(query, donorInput, (err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.insertId);
                })
                //app breaking point: Cannot read property 'insertId' of undefined
            });

            return {
                first_name : params.first_name,
                last_name : params.last_name
            } //result

        }catch (error){
            console.log(error)
        }
    }

} module.exports = DbServer;

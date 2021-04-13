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
    console.log('db ' + con.state);
});

class DbServer {
    static getDbServerInstance(){
        return instance ? instance : new DbServer();
    };

    //async await to get data READ
    async getAllData(){
        try {
            const response = await new Promise((resolve,reject) => { //Promise is where we handle queries
                //if query is successful, resolve it or rejct and catch err
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
        console.log(params)
        try{
            const insertId = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO donors SET ?'

                con.query(query, params, (err,res) => {
                    if (err) reject(new Error(err.message));
                    resolve(res.insertId);
                })
            });

            
            // console.log(insertId)
            return {
                id : insertId, params

            }

        }catch (error){
            console.log(error)
        }
    }
} module.exports = DbServer;

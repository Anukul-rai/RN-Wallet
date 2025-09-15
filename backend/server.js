import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001 ;

async function initDB() {
    try{
        await sql
    }catch(err){
        console.log("DB connection failed");
    }
}

app.get('/',(req,res)=>{
    res.send("Hello Ashesh");
})
// console.log("my port :",process.env.PORT);

app.listen(PORT,()=>{
    console.log("Server is running on port:",PORT);
})
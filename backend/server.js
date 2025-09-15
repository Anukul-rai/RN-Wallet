import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();

//Middleware(built-in)----between req and res
app.use(express.json());

//Custom simple middleware
// app.use((req,res,next)=>{
//     console.log("Hey we can hit a req, the method is",req.method,"and the url is",req.url);
//     next();
// })

const PORT = process.env.PORT || 5001 ;

async function initDB() {
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log("Database initialized successfully")
    }catch(err){
        console.log("DB connection failed:",err);
        process.exit(1); // status code 1 means failure,0 sucess
    }
}

app.get('/',(req,res)=>{
    res.send("API is running....");
})

app.post("/api/transactions",async (req,res)=>{
    // title,amt,category.user_Id
    try {
        const {title,amount,category,user_id}=req.body

        if(!title || amount === undefined || !category || !user_id){
            return res.status(400).json({message:"All fields are required"});
        }
        const transactions = await sql`
        INSERT INTO transactions(title,amount,category,user_id)
        VALUES(${title},${amount},${category},${user_id})
        RETURNING *;
        `
        console.log(transactions)
        res.status(201).json(transactions[0]);
    } catch (error) {
        console.log("Error in POST /api/transactions:",error);
        res.status(500).json({message:"Internal server Error"});
    }
})


initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
});
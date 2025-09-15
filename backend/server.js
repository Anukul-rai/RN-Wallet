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


app.get('/api/transactions/:userId',async (req,res)=>{
    try {
        const {userId} = req.params;
        const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `
        res.status(200).json(transactions);
        // console.log(userId)
    } catch (error) {
        console.log("Error getting in transcations",error);
        res.status(500).json({message:"Internal server Error"});
    }
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

app.delete("/api/transactions/:id",async (req,res)=>{
    try {
        const {id}= req.params;

        if (isNaN(parseInt(id))){
            return res.status(400).json({message:"Invalid transaction id"});
        }
        const result = await sql`
        DELETE FROM transactions WHERE id=${id} RETURNING *;
        `
        if(result.length === 0){
            return res.status(404).json({message:"Transaction not found"});
        }
        res.status(200).json({message:"Transaction deleted successfully"});
    } catch (error) {
        console.log("Error in DELETE /api/transactions/:id",error);
        res.status(500).json({message:"Internal server Error"});
    }
})

initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
});
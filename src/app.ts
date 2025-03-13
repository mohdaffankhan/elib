import express from "express";

const app = express();

app.get('/',(req, res)=>{
    res.json({message:"welcome to elib apis"})
})

export default app;
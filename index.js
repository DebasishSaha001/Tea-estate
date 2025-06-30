import express from "express";
import bodyParser from "body-parser";
import {Client} from "pg";

const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const port=3000;
const db= new Client({
    user:"postgres",
    host:"localhost",
    database:"Maijonga",
    password:"password",
    port:5432
});
db.connect();

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/visit",async(req,res)=>{
    const name=req.body.name;
    const phn=req.body.phone;
    const email=req.body.email;
    const date=req.body.date;
    const msg=req.body.message;
    try{
        await db.query("INSERT INTO visits (name,phone_num,email,date,messege) VALUES ($1,$2,$3,$4,$5)",[name,phn,email,date,msg]);
    } catch(err){
        console.log(err)
    }
    res.redirect("/");
});

app.listen(port,(req,res)=>{
    console.log(`Server running on port: ${port}`);
});
import express from "express";
import bodyParser from "body-parser";
import {Client} from "pg";
import 'dotenv/config'

const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const port= process.env.PORT;

const db= new Client({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
try{
    db.connect();
    console.log("connected.");
}catch(err){
    console.log("not connect.");
}
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
        console.log("First query error.");
    }
    res.redirect("/");
});

app.get("/shop",(req,res)=>{
    res.render("product.ejs")
});

let qty=1;

app.post("/buy",(req,res)=>{
    qty=req.body.qty;
    let st=599*qty;
    let tax=Math.floor(0.18*st);
    let tot=st+tax;
    res.render("checkout.ejs",{
        qty: qty,
        st: st,
        tax:tax,
        tot:tot,
    });
});

app.post("/checkout",async(req,res)=>{
    const name=req.body.name;
    const phn=req.body.phone;
    const email=req.body.email;
    const address=req.body.address;
    const referNum=req.body.refernum;
    try{
        await db.query("INSERT INTO orders (name,phone_num,email,address,transaction) VALUES ($1,$2,$3,$4,$5)",[name,phn,email,address,referNum]);
    } catch(err){
        console.log("Second query error.");
    }
    res.redirect("/");
});

app.listen(port,(req,res)=>{
    console.log(`Server running on port: ${port}`);
});
const express = require("express")
const users = require('./sample.json')
const cors = require('cors')
const fs = require("fs")

const app = express()
app.use(express.json())
const port = 8500

app.use(
    cors({
        origin:"http://localhost:5173",
        methods:["GET","POST","PATCH","DELETE"],
    })
)

app.get("/users",(req,res)=>{
    return res.json(users)
})

app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id)
    const filterUsers = users.filter((user)=>user.id!==id)
    fs.writeFile("./sample.json",JSON.stringify(filterUsers),(err,data)=>{
        return res.json(filterUsers)
    })
})

app.post("/users",(req,res)=>{
    let { name, age, city } = req.body
    if(!name || !age || !city){
        res.status(400).send({Message:"All fields required"})
    }
    let id = Date.now()
    users.push({ id, name, age, city })
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({Message:"User deteil added success"})
    })
   
})

app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id)
    let {name,age,city} = req.body
    if(!name || !age || !city){
        return res.status(400).send({Message:"All fields required"})
    }
    let index = users.findIndex((user)=>user.id==id)
    users.splice(index,1,{ ...req.body })
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({Message:"User deteil update success"})
    })
})

app.listen(port,(req,res)=>{
    console.log(`App is running in port ${port}`)
})
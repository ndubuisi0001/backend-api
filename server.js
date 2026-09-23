const express = require ("express");
const app = express();
app.use(express.json());
const users = require("./data.json");
app.get("/",(req, res) => { res.json ({ message: "BACKEND API RUNNING"});});
app.get("/api", (req, res) => { res.json({ 
    name: "users API", 
    version: "1.0.0", 
    description:"A beginner users API",
    endpoints:[
        "GET /api/users",
        "GET /api/users/count",
        "GET /api/users/:id",
      "GET /api/users?name=NAME"
    ]
});
});
app.get("/api/users", (req, res) => { const name = req.query.name; if (name) { const results = users.filter( (user)=> user.name.toLowerCase () === name.toLowerCase());return res.json (results);}res.json(users);});
app.get("/api/users/count", (req, res) => {res.json ({ count:users.length});});
 app.get("/api/users/:id", (req, res) => { const id= Number(req.params.id); const user = users.find((user) => user.id === id);
if (!user) {return res.status(404).json({ message:"users not found"});}res.json(user);});
app.use((req, res) => {res.status (404).json ({message: "PLEASE FIND ANOTHER ROUTE, THIS ROUTE DOESN'T EXIST"});});
app.listen (3000, () => { console.log("server running on http://localhost:3000"); });
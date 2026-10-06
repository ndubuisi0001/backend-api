const express = require ("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
const datapath = path.join(__dirname, "data.json");
function readUsers () { return JSON.parse (fs.readFileSync(datapath, "utf8"));}
function saveUsers(users) { fs.writeFileSync(datapath, JSON.stringify(users,null,2));}
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
app.get("/api/users", (req, res) => {const users = readUsers(); const name = req.query.name; if (name) { const results = users.filter(user=> user.name.toLowerCase ().includes (name.toLowerCase()));return res.json (results);}res.json(users);});
app.get("/api/users/count", (req, res) => {const users = readUsers();res.json ({ count:users.length});});
 app.get("/api/users/:id", (req, res) => { const users = readUsers();const id= Number(req.params.id); const user = users.find((user) => user.id === id);
if (!user) {return res.status(404).json({ message:"users not found"});}res.json(user);});
app.post("/api/users", (req, res)=> {const {name, email, age} = req.body;
if (!name|| !email|| age === undefined) {return res.status(400).json({message: "Name , email and age are required"});}
const users = readUsers();
const newId = users.length > 0 
? Math.max(...users.map((user) => 
  user.id))+
1
     : 1;
const newUser = {
   id: newId, 
  name, 
  email, 
  age
};
users.push (newUser);
saveUsers(users);
res.status(201).json(newUser); 
});
app.delete("/api/users/:id", (req, res) => {
  const users = readUsers();
  const id = Number(req.params.id);
  const userIndex = users.findIndex( user => user.id === id);
if (userIndex === -1) { return res.status(404).json ({message: "user not found"});}
const deleteUser = users.splice(userIndex, 1)[0];
saveUsers (users);
res.json({ message: "user deleted successfully",  user: deleteUser}); });
app.put ("/api/users/:id", (req, res) => { 
  const users = readUsers();
  const id = Number(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {return res.status(404).json ({message: "user not found"});}
  const {name, email, age} = req.body;
  if (!name || !email || age === undefined) {return res.status(404).json({message: "Name, email and age are required"});}
  users[userIndex] = {
    id:id, 
    name:name, 
    email:email, 
    age:age
  };
  saveUsers(users);
  res.json({message: "user updated successfully", user:users[userIndex]});
});
app.patch ("/api/users/:id", (req, res) => {const users = readUsers(); 
const id = Number(req.params.id); 
const userIndex = users.findIndex (user => user.id === id); 
if (userIndex === -1){return res.status(404).json ({message:"user not found"});}
const {name, email, age } = req.body;
if (name !== undefined ) {users [userIndex].name = name;
}
if (email !== undefined) {users[userIndex].email = email;
}
if (age !== undefined) {users[userIndex].age = age;
}
saveUsers(users);
  res.json({message: "user updated successfully", user:users[userIndex]});
});
app.use((req, res) => {res.status (404).json ({message: "PLEASE FIND ANOTHER ROUTE, THIS ROUTE DOESN'T EXIST"});});
app.listen (3000, () => { console.log("server running on http://localhost:3000"); });
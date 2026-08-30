const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("backend API is running");
});
app.get("/api/users", (req, res) => {
    const data = fs.readFileSync("data.json", "utf8");
    const users = JSON.parse(data);
    res.json(users);
});
app.get("/api/users/:id", (req, res)  => {
    const id = Number(req.params.id);
    const data = fs.readFileSync("data.json", "utf8");
    const users = JSON.parse(data);
     const user = users.find(user => user.id === id);
     if (!user) {
        return res.status(404).json({
            message:"user not found"
        });
    }
     res.json(user);
});
    app.listen(3000, () => {
    console.log("sever running on port 3000");
    });
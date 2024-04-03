const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname + "/cart.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/blockchain", (req, res) => {
  res.sendFile(path.join(__dirname + "/blockchain.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname + "/contact.html"));
});




const server = app.listen(process.env.PORT||5000);
const portNumber = server.address().port;
console.log(`port: ${portNumber}`);

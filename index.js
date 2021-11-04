const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
dotenv.config();

mongoose.connect(process.env.MONGO_URL) 
.then(()=>{
    console.log("database connected successfully")
}).catch((err)=>{
    console.log(err);
});

app.use(express.json());

app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute); 
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute); 

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

app.listen(process.env.PORT || 5000, ()=>{
    console.log(`server is running at port no ${process.env.PORT}`)
});   
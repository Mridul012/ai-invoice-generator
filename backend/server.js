require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');
const { METHODS } = require("http");

const authRoutes = require("./routes/authroutes");
const invoiceRoutes = require("./routes/invoiceroutes");
const aiRoutes = require("./routes/airoutes");

const app = express();

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
}));


connectDB();

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/invoices",invoiceRoutes);
app.use("/api/ai",aiRoutes)




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
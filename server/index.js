const express = require("express");
require('dotenv').config({ });
const cors = require("cors");
const morgan = require('morgan') 
require("./db/db.js")


const app = express();

// Morgan: middleware for logging HTTP requests (method, URL, status, response time)
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

// route for morgan test
app.get('/', (req, res) => {
  res.send('Hello Morgan!');
})


const childRoutes = require("./routers/routes/children.js");
app.use(childRoutes);

const authRoutes = require("./routers/routes/auth.js")
app.use(authRoutes)

const userRouter = require("./routers/routes/user.js")
app.use(userRouter)

const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
  console.log(`server run on ${PORT}`);
});
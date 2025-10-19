const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const db = require("./db/index.js");

const app = express();
app.use(cors());
app.use(express.json());

// const roleRouter = require("./Routers/routes/role");
// app.use(roleRouter);

// const userRouter = require("./Routers/routes/user");
// app.use(userRouter);

// const statusRouter = require("./Routers/routes/status");
// app.use(statusRouter);

// const appointmentRouter = require("./Routers/routes/appointment");
// app.use(appointmentRouter);

// const dossesRouter = require("./Routers/routes/dosses");
// app.use(dossesRouter);

// const readingsRouter = require("./Routers/routes/readings");
// app.use(readingsRouter);


const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
  console.log(`server run on ${PORT}`);
});
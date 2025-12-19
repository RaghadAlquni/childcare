const express = require("express");
require('dotenv').config();
const cors = require("cors");
const morgan = require('morgan') 
require("./DB/db.js");
const axios = require("axios");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");


require("./scripts/subscriptionMonitor.js");

const app = express();
// احنا نحتاج نسوي ميدل وير يحول لنا الجيسون الى كائن جافاسكربت
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_ID;
// Morgan: middleware for logging HTTP requests (method, URL, status, response time)
app.use(morgan('dev'))
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://childcare-4muz.onrender.com",
    ];

    // يسمح للـ Postman و الـ Swagger و Tools الأخرى
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.post("/send-whatsapp", async (req, res) => {
  try {
    const { recipient, message } = req.body;

    const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
    const data = {
      messaging_product: "whatsapp",
      to: recipient,
      type: "text",
      text: { body: message },
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


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

const branchRouter = require("./routers/routes/branch.js")
app.use(branchRouter)


const eventRouter = require("./routers/routes/event.js")
app.use(eventRouter)

const subscriptionRouter = require("./routers/routes/subscription.js")
app.use(subscriptionRouter)

const classroomRouter = require("./routers/routes/classroom.js")
app.use(classroomRouter)

const dashboardStateRouter = require("./routers/routes/dashboardState.js")
app.use(dashboardStateRouter)

const moneyRouter = require("./routers/routes/money.js")
app.use(moneyRouter)

const attendanceRouter = require("./routers/routes/attendance.js")
app.use(attendanceRouter)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
  console.log(`server run on ${PORT}`);
});
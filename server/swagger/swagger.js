const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Childcare API",
      version: "1.0.0",
      description: "API documentation for the project",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    // 🔐 JWT CONFIG
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

  },

  apis: [path.join(__dirname, "../routers/**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

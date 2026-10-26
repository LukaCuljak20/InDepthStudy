const path = require("path");
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");

const requestLogger = require("./middleware/requestLogger");
const flash = require("./middleware/flash");
const { errorHandler } = require("./middleware/errorHandler");
const eventRoutes = require("./routes/events");

const app = express();

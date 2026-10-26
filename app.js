const path = require("path");
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");

const requestLogger = require("./middleware/requestLogger");
const flash = require("./middleware/flash");
const { errorHandler } = require("./middleware/errorHandler");
const eventRoutes = require("./routes/events");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.locals.fmtDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

app.use(requestLogger);

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "dev-only-secret-change-me",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash);

app.get("/", (req, res) => res.redirect("/events"));
app.use("/events", eventRoutes);

app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Event manager listening on http://localhost:${PORT}`);
  });
}

module.exports = app;

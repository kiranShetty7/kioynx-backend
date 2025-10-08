const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDb = require("./config/dbConnection");
const userRouter = require("./routers/userRouter");
const appRouter = require("./routers/appRouter");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
connectToDb();
dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send(`<h1>Kionyx apis are working</h1>`);
});
app.use("/v1/user", userRouter);
app.use("v1/apps", appRouter);

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

app.listen(PORT, () => {
  console.log(`Kionyx server is operational on port ${PORT}.`);
});

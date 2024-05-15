import express from "express";
/* import mongoose from "mongoose";
import session from "express-session"; 
import cors from "cors"; */
import router from "./routes/index.js";

const app = express();
app.use(express.json());
/* app.use(
  cors({
    origin: "http://localhost:5173",
  })
); */

/* app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true,
})); */

const PORT = 8080;
/*  */

/* mongoose
  .connect(db)
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((e) => {
    console.error(`Base de datos no conectada, error: ${e}`);
  }); */

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

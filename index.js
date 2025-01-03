import express from "express";
import bootstrap from "./src/app.controller.js";
import * as dotenv from "dotenv";

dotenv.config({ path: "./src/config/.env" });

const app = express();

const PORT = process.env.PORT;

bootstrap(app, express);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

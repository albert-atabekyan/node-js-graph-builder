import fs from "fs";
import { cors } from "./modules/functions.js";
import router from "./modules/router/router.js";
import express from 'express';

const PORT = 5000;
const app = express();

app.use(cors);
app.use("/", router);

app.listen(PORT, () => console.log("START"));

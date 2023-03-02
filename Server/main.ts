import express from 'express';
import {Request,Response} from 'express';
import { env } from "./env";
import cors from "cors";
import path from "path";
import { routes } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("./uploads")));
app.use(routes);

// app.get('/',function(req:Request,res:Response){
//     res.end("Hello World");
// })

app.listen(env.port, () => {
    console.log(`Listening at http://localhost:${env.port}/`);
});
import express from "express"; 
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js"
import * as TaskController from "./controllers/TaskController.js"


//Connect Database
mongoose
    .connect("mongodb+srv://admin:admin@cluster0.mwrpo11.mongodb.net/Emojicon?retryWrites=true&w=majority");
    .then(() => console.log("DB is OK"));
    .catch((err) => console.log("DB error", err));

const app = express();
app.use(express.json());

//Start server
app.listen(4444, (err) => {
    if (err){
        return console.log(err);
    }
    console.log("Server started...");
}); 

//Auth
app.post("/login", loginValidation, UserController.login);
app.post("/register", registerValidation, UserController.register);
app.get("/me", checkAuth, UserController.getMe);

//Tasks

app.get("/tasks", checkAuth, TaskController.getAll);
app.post("/tasks", checkAuth, TaskController.create);

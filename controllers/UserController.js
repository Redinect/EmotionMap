import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { validationResult } from "express-validator"
import UserSchema from "../models/user.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserSchema({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 
        "secret123",
        {
            expiresIn: "30d",
        },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    }
    catch (err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserSchema.findOne({email: req.body.email});

        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){ 
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 
        "secret123",
        {
            expiresIn: "30d",
        },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: "Ошибка авториации",
        });
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await UserSchema.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(userData);
    }catch (err){
        console.log(err);

        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


        res.status(500).json({
            message: "Не удалось проверить пользователя",
        });
    }
};
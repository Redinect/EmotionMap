import TaskSchema from "../models/task.js"
import jwt from "jsonwebtoken";

//Получить все таски пользователя

export const getAll = async (req, res) => {
    try {

        const token = (req.headers.authorization).replace(/Bearer\s?/, "");
        const decoded = jwt.verify(token, "secret123");

        const tasks = await TaskSchema.find({user: decoded._id});

        res.json(tasks);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Что-то пошло не так",
        });
    }
};

// Добавить таску

export const create = async (req, res) => {
try {
    const doc = new TaskSchema({
        title: req.body.title,
        tag: req.body.tag,
        title: req.body.title,
        user: req.userId,
    });

    const task = await doc.save();

    res.json(task);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Что-то пошло не так",
        });
    }
};
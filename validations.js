import { body } from "express-validator"

export const registerValidation = [
    body("fullName", "Имя слишком короткое").isLength({ min: 3}),
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен содержать минимум 8 символов").isLength({ min: 8}),
];

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен содержать минимум 8 символов").isLength({ min: 8}),
];


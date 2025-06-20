import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
    console.log("Request body:", req.body); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Received data is not valid",
            errors: errors.array()
        });
    }
    next();
};

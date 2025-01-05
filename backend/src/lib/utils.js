import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
    });
    res.cookie("jwt", token, {
        httpOnly: true, // prevent XSS attacks cross site scripting attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //CSRF attacks cross- site request forgery
        maxAge: 60 * 60 * 1000,
    });

    return token;
}
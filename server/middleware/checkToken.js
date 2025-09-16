import jwt from "jsonwebtoken";
import Employee  from "./../models/employeeModel.js";
import asyncHandler from "express-async-handler";

export const checkToken = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.token;
    if(token){
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await Employee.findById(decodedToken.userId).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Invalid token !");
        }
    }else{
        res.status(404);
        throw new Error("Unauthorized !");
    }
})
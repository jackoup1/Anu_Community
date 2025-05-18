import { Request, Response } from "express";
import argon2 from 'argon2'
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma";


export async function login(req :Request, res: Response) {
    const {email, password} = req.body;
    console.log(email);
    try{

        const user = await prisma.user.findUnique({
            where:{email},
            select:{id:true, email: true, password: true, role: true, level:true, department: true}}
        );
        if(!user){
            res.status(404).json({message:"user not found"});
            return;
        }
        const isValid = await argon2.verify(user.password, password);

        if(!isValid){
            res.status(401).json({ message: "Invalid password" }); return;
        }
        

        if(user.role === "ADMIN"){
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: "ADMIN",
                level: user.level,
                department: user.department
                },
                process.env.JWT_SECRET!,{expiresIn: "24h"}
            );
            res.json({token});
        }
        else{
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: "USER",
                level: user.level,
                department: user.department
                },
                process.env.JWT_SECRET!,{expiresIn:"1y"}
            );
            res.json({token});
        }
    }catch(err) {
        console.error(err);
        res.status(500).json({message:"login failed"});
    }
}


export async function signUp(req:Request, res: Response) {
    const {username, departmentId, level, email, password} = req.body; 

    try {
        const existingEmail = await prisma.user.findUnique({where: {email}, select:{email: true}});
        if(existingEmail){
            res.status(400).json({message:"Email already exists"});
            return;
        }

        //checking for existing username
        const existingUsername = await prisma.user.findUnique({where:{username}, select: {username: true}});
        if(existingUsername){ res.status(400).json({message:"username already exists"}); return;}

        const hashedPassword = await argon2.hash(password);


        await prisma.user.create({
            data:{
                username,
                departmentId,
                level,
                email,
                password: hashedPassword,
            }
        });

        res.status(200).json({message:"user added successfully"});
        return;


    }catch(err) {
        console.error(err);
        res.status(500).json({message: "internal error please try again"});
        return;
    }



}
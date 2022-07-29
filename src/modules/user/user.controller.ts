import { Request, Response } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import { registerUserBody } from "./user.schema";
import { createUser } from "./user.service";
import { User } from "./user.model";



export async function registerUser(req: Request<{}, {}, registerUserBody, {}>, res: Response) {
    const { username, fullName, email, password, image } = req.body;
    console.log(req.body);

    try {
        
        let user: User;

        req.busboy.on("file", async function(_, file, info) {
            console.log(file)
            
            console.log("here")
            /* user = await createUser({ username, fullName, email, password, image: info.filename });

            const filePath = getImagePath(user.image);

            const stream = fs.createWriteStream(filePath);

            file.pipe(stream); */

        });

        req.busboy.on("field", function(fieldName, val){
            console.log(fieldName, val);
        })

       

        /* req.busboy.on("close", () => {
            res.writeHead(StatusCodes.CREATED, {
                connection: "close",
                "Content-Type": "application/json"
            });
            res.write(JSON.stringify(user));
            res.end();
            
        }) */

       req.busboy.on("finish", function(){
           return req.pipe(req.busboy);
       })

    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(StatusCodes.CONFLICT).send("User already exists");
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
}
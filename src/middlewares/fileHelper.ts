import { Request, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { getImagePath } from "../utils/helpers";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 12);

const MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const fileHelper = (req: Request, res, next: NextFunction) => {

    let image: string;

    req.busboy.on("finish", function () {
        next();
    });

    req.busboy.on("file", async function (_, file, info) {
        if (!MIME_TYPES.includes(info.mimeType)) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid File Type!");
        }
        const uniqueName = nanoid();
        const ext = path.extname(info.filename);
        const filePath = getImagePath(uniqueName, ext);
        req.body["image"] = filePath;
        const stream = fs.createWriteStream(filePath);
        file.pipe(stream);
    })

    req.busboy.on("field", async function (fieldName, fieldValue) {
        req.body[fieldName] = fieldValue;
    });

    req.pipe(req.busboy)
};
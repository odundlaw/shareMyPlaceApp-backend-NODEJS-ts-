import fs from "fs";
import { customAlphabet } from "nanoid";

export function getImagePath(imageName: string, extension: string, path: string) {
    return `${process.cwd()}/${path}/${imageName}${extension}`;
}

export function deleteFile(filePath: string) {
    fs.unlink(filePath, (error) => {
        if (error) {
            throw (error)
        }
    });
}

export function omit<T>(obj: T, property: keyof T | (keyof T)[]) {
    if (Array.isArray(property)) {
        const arrayObj = Object.entries(obj).filter(entry => {
            const [key] = entry;
            return !property.includes(key as keyof T);
        })

        return Object.fromEntries(arrayObj);
    }

    const { [property as keyof T]: unused, ...rest } = obj;
    return rest;
}

export function generateRandomCharacters(length: number): NonNullable<string> {
    return (customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", length) as any) as string;
}

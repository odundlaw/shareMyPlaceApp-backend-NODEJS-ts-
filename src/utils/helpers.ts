import fs from "fs";

export function getImagePath(imageName: string, extension: string) {
    return `${process.cwd()}/images/${imageName}${extension}`;
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

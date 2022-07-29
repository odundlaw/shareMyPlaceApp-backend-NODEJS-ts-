export function getImagePath(imageName: string, extension: string) {
    return `${process.cwd()}/images/${imageName}${extension}`;
}

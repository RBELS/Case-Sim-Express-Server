import { Router } from "express"
const rootFolders = ['img'];

const img = Router();

img.get('*', (req, res) => {
    const serverDirectory = __dirname.replace(new RegExp("\\\\", 'g'), "/");
    const filePath = `${serverDirectory}/img/${req.url}`;
    const rootFolder = req.url.split('/')[1];

    if (!rootFolder.includes(rootFolder)) {
        res.end("Error 404: No such file or Directory.");
    }

    try {
        res.sendFile(filePath);
    } catch (error) {
        res.send("Error 404: No such file or Directory.");
    }
});

export default img

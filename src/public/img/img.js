const { Router } = require('express');
const rootFolders = ['img'];

const img = new Router();

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

module.exports = img;






// const express = require('express');
// const app = express();

// const PORT = 4000;

// const rootFolders = ['img'];

// app.get('*', (req, res) => {
//     const serverDirectory = __dirname.replace(new RegExp("\\\\", 'g'), "/");
//     const filePath = `${serverDirectory}${req.url}`;
//     const rootFolder = req.url.split('/')[1];


//     // const text = fs.readFileSync(filePath);
//     if (!rootFolders.includes(rootFolder)) {
//         res.end("Error 404: No such file or Directory.");
//     }

//     try {
//         res.sendFile(filePath);
//     } catch (error) {
//         res.send("Error 404: No such file or Directory.");
//     }


// })


// app.listen(PORT);
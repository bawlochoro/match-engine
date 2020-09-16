const fs = require('fs');
const path = require('path');

const serveStatic = require('serve-static');
const serveIndex = require('serve-index');

const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const xl = require('excel4node');

const util = require('./util');
const validator = require('./validator');

const upload = multer({dest: 'uploads/'});

const app = express();
const port = 3000;

app.use(serveStatic(path.join(__dirname, 'build')));

app.post('/upload', upload.array('myfile', 2), function (req, res, next) {
    const files =  req.files;
    const fileTypes = req.body.type.split(',');
    const filesData = {};

    fs.createReadStream(files[0].path).pipe(csv()).on('data', data => {
        filesData[fileTypes[0]] = util.processCsvFile(fileTypes[0], data, filesData);
    }).on("end", () => {
        fs.unlinkSync(files[0].path); 
        fs.createReadStream(files[1].path).pipe(csv()).on('data', data => {
            filesData[fileTypes[1]] = util.processCsvFile(fileTypes[1], data, filesData);
        }).on("end", () => {
            fs.unlinkSync(files[1].path); 
            for(var i=0; i<filesData[fileTypes[0]].data.length; i++) {
                const errorMapping = validator(filesData[fileTypes[0]].data[i], filesData[fileTypes[1]].data[i]);
                filesData[fileTypes[0]].data[i].errorMapping = errorMapping[fileTypes[0]];
                filesData[fileTypes[1]].data[i].errorMapping = errorMapping[fileTypes[1]];
            }
            res.send(filesData);
        });
     });
});

app.post('/upload/export', upload.array('myfile', 2), function (req, res, next) {
    const files =  req.files;
    const fileTypes = req.body.type.split(',');
    const filesData = {};
    
    fs.createReadStream(files[0].path).pipe(csv()).on('data', data => {
        filesData[fileTypes[0]] = util.processCsvFile(fileTypes[0], data, filesData);
    }).on("end", () => {
        fs.unlinkSync(files[0].path); 
        fs.createReadStream(files[1].path).pipe(csv()).on('data', data => {
            filesData[fileTypes[1]] = util.processCsvFile(fileTypes[1], data, filesData);
        }).on("end", () => {
            fs.unlinkSync(files[1].path); 
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet(fileTypes[0]);
            const ws2 = wb.addWorksheet(fileTypes[1]);

            const headerStyle = wb.createStyle({
                font: { color: "black", bold: true }
            });

            for(let j=0; j<filesData[fileTypes[0]].header.length; j++) {
                ws.cell(1, j+1).string(filesData[fileTypes[0]].header[j]).style(headerStyle);
            }

            for(let j=0; j<filesData[fileTypes[1]].header.length; j++) {
                ws2.cell(1, j+1).string(filesData[fileTypes[1]].header[j]).style(headerStyle); 
            }

            for(let i=0; i<filesData[fileTypes[0]].data.length; i++) {
                const errorMapping = validator(filesData[fileTypes[0]].data[i], filesData[fileTypes[1]].data[i]);

                for(let j=0; j<filesData[fileTypes[0]].header.length; j++) {
                    if(errorMapping && errorMapping[fileTypes[0]] && errorMapping[fileTypes[0]][filesData[fileTypes[0]].header[j]]) {
                        ws.cell(i+2, j+1).string(filesData[fileTypes[0]].data[i][filesData[fileTypes[0]].header[j]]).style(util.getStyle(wb, errorMapping[fileTypes[0]][filesData[fileTypes[0]].header[j]]));
                    } else {
                        ws.cell(i+2, j+1).string(filesData[fileTypes[0]].data[i][filesData[fileTypes[0]].header[j]]);
                    }
                }

                for(let j=0; j<filesData[fileTypes[1]].header.length; j++) {
                    if(errorMapping && errorMapping[fileTypes[1]] && errorMapping[fileTypes[1]][filesData[fileTypes[1]].header[j]]) {
                        ws2.cell(i+2, j+1).string(filesData[fileTypes[1]].data[i][filesData[fileTypes[1]].header[j]]).style(util.getStyle(wb,  errorMapping[fileTypes[1]][filesData[fileTypes[1]].header[j]]));
                    } else {
                        ws2.cell(i+2, j+1).string(filesData[fileTypes[1]].data[i][filesData[fileTypes[1]].header[j]]);
                    }
                }
            }
            wb.write('export.csv', res);
        });
     });
});

app.use('/', express.static('dist'), serveIndex('dist', { icons: true }));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
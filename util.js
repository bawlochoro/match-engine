var util = {
    processCsvFile: function(fileType, rowData, filesData) {
        if(!filesData[fileType]) {
            filesData[fileType] = {
                header: rowData,
                data: []
            };
        } else {
            const row = {};
            for(var i=0; i<filesData[fileType].header.length; i++) {
                row[filesData[fileType].header[i]] = rowData[i];
            }
            filesData[fileType].data.push(row);
        }
        return filesData[fileType];
    },
    getStyle: function(wb, color) {
        return wb.createStyle({
            fill: {
                type: "pattern",
        patternType: "solid",
                fgColor: color
            },
        });
    }
}

module.exports = util;
import fs  from 'fs';
import path  from 'path';
import xlsx  from 'xlsx';

function convertXlsxToCsv(xlsxFilePath) {
    const workbook = xlsx.readFile(xlsxFilePath);
    const sheetName = workbook.SheetNames[0]; //
    const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);

    return csvData;
}

function convertFolderToCsv(inputFolderPath, outputFolderPath) {
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
    }

    // Read the contents of the input folder
    const files = fs.readdirSync(inputFolderPath);

    // Iterate over the files
    files.forEach(file => {
        const filePath = path.join(inputFolderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // If it's a directory, recursively convert its contents
            const newOutputFolder = path.join(outputFolderPath, file);
            convertFolderToCsv(filePath, newOutputFolder);
        } else if (path.extname(filePath).toLowerCase() === '.xlsx') {
            // If it's an XLSX file, convert it to CSV and write to the output directory
            const csvData = convertXlsxToCsv(filePath);
            const newFilePath = path.join(outputFolderPath, path.basename(filePath, '.xlsx') + '.csv');
            fs.writeFileSync(newFilePath, csvData);
        }
    });
}

// Define input and output directories
const inputFolder = './2012';
const outputFolder = './2012_csv';

// Start the conversion process
convertFolderToCsv(inputFolder, outputFolder);

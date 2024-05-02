import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Define the main folder path
const mainFolder = '2012';
const processedFolder = '2012-processed';

// Create a new directory for processed files
if (!fs.existsSync(processedFolder)) {
  fs.mkdirSync(processedFolder);
}

// Function to process Excel files in a month folder
function processMonthFolder(monthFolder) {
  const monthPath = path.join(mainFolder, monthFolder);

  // Read all files in the month folder
  const files = fs.readdirSync(monthPath);

  // Filter Excel files
  const excelFiles = files.filter((file) => file.endsWith('.xlsx'));

  // If there are Excel files
  if (excelFiles.length > 0) {
    // Create an empty array to store workbook data
    const workbookData = [];

    // Flag to track if it's the first file in the month
    let isFirstFile = true;

    // Read each Excel file and push data into workbookData array
    excelFiles.forEach((file) => {
      const filePath = path.join(monthPath, file);
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];
      let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // If it's not the first file, remove the header rows
      if (!isFirstFile) {
        data = data.slice(8); // Remove the first 8 rows
      } else {
        isFirstFile = false;
      }

      workbookData.push(data);
    });

    // Combine all data into one array
    const combinedData = workbookData.flat();

    // Create a new workbook
    const newWorkbook = XLSX.utils.book_new();

    // Add combined data to a new worksheet
    const newWorksheet = XLSX.utils.aoa_to_sheet(combinedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');

    // Write the new workbook to a file
    const combinedFilePath = path.join(processedFolder, `${monthFolder}.xlsx`);
    XLSX.writeFile(newWorkbook, combinedFilePath);

    console.log(
      `Combined files for ${monthFolder} and saved as ${combinedFilePath}`,
    );
  }
}

// Iterate through each month folder
fs.readdirSync(mainFolder).forEach((monthFolder) => {
  const monthFolderPath = path.join(mainFolder, monthFolder);
  const stats = fs.statSync(monthFolderPath);

  // Check if it's a directory
  if (stats.isDirectory()) {
    processMonthFolder(monthFolder);
  }
});

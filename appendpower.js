import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
// import combineData from './combinedata';

// Function to process each month's folder
function processMonthFolder(monthFolder, outputFolderPath) {
  const files = fs.readdirSync(monthFolder);
  let monthData = {};
// console.log(monthFolder, "montfolder")
// console.log(files, "files")
  // Loop through each file in the month folder
  files.forEach((file) => {
    const filePath = path.join(monthFolder, file);
// monthData = {}
    // Ignore directories
    if (!fs.statSync(filePath).isFile()) {
      return;
    }

    const day = parseInt(path.parse(file).name, 10);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    // console.log(sheetName)
    const worksheet = workbook.Sheets[sheetName];
    let rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
// console.log(rows)

    // Ignore the first 8 rows
    rows.splice(0, 8);
    // console.log(rows)
    
    // Extract the power data from the third column
    let powerData = rows.map((row) => row[3]);
    powerData  = powerData.map((ele, index)=> {
      if (!ele){
        ele = 0
      }
      return ele
    })
    
    // Append the power data to the monthData object
    monthData[day] = powerData;
    powerData = []
    // console.log(monthData)
  });


// Prepare headers for each day
const headers = [];
const transposedData = Object.keys(monthData).map(day => monthData[day]);
for (let day = 1; day <= Object.keys(monthData).length; day++) {
  headers.push(`Day ${day}`);
}

// Combine headers with data vertically
const dataWithHeaders = [];
const maxRows = Math.max(...transposedData.map(dayData => dayData.length));
for (let i = 0; i < maxRows; i++) {
  const rowData = [];
  for (let j = 0; j < headers.length; j++) {
    const dayData = transposedData[j] || []; // Use empty array if no data for the day
    rowData.push(dayData[i] || ''); // Push value for the current row and column
  }
  dataWithHeaders.push(rowData);
}





  const newWorkbook = xlsx.utils.book_new();
  const newWorksheet = xlsx.utils.aoa_to_sheet([Object.keys(monthData).map((day) => `Day ${day}`),
    ...dataWithHeaders]);

  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Power Data');
  const outputFilePath = path.join(
    outputFolderPath,
    `${path.basename(monthFolder)}.xlsx`,
  );
  xlsx.writeFile(newWorkbook, outputFilePath);
}

// Function to process each year's folder
// ignored will be use another time
function processYearFolder(yearFolder, outputRootPath) {
  const months = fs.readdirSync(yearFolder);

  months.forEach((day) => {
    console.log(day,"day");
    // Sanitize folder name
    const sanitizedMonth = day
      .replace(/[^a-zA-Z0-9]/g, '')
      .split('xlsx')
      .splice(1, 0, '.')
      .join('');
    // console.log(sanitizedMonth);
    // const monthFolder = path.join(yearFolder, day);
    const sanitizedMonthFolder = path.join(yearFolder, sanitizedMonth);
    console.log(sanitizedMonthFolder, "sanitizedMonthFolder")
    if (
      fs.existsSync(sanitizedMonthFolder) &&
      fs.statSync(sanitizedMonthFolder).isDirectory()
    ) {
      const outputMonthFolder = path.join(outputRootPath, sanitizedMonth);
      console.log(outputMonthFolder, "outputMonthFolder")
      if (!fs.existsSync(outputMonthFolder)) {
        fs.mkdirSync(outputMonthFolder, { recursive: true });
      }
      processMonthFolder(sanitizedMonthFolder, outputMonthFolder);
    }
  });
}

// Main function to start the process
function main() {
  const mainFolder = './2012'; // Path to the main folder containing year-wise subfolders
  const outputRootFolder = './power-agg2'; // Path to the output root folder

  // Check if the main folder exists
  if (!fs.existsSync(mainFolder)) {
    console.error('Main folder does not exist.');
    return;
  }

  // Create output root folder if it doesn't exist
  if (!fs.existsSync(outputRootFolder)) {
    fs.mkdirSync(outputRootFolder, { recursive: true });
  }

  // Process each year's folder
  const months = fs.readdirSync(mainFolder);
    // console.log(months, "months");
  months.forEach((month) => {
    const monthFolder = path.join(mainFolder, month);
    // console.log(monthFolder,"monthFolder");
    if (fs.existsSync(monthFolder) && fs.statSync(monthFolder).isDirectory()) {
      // console.log('processYear folder');
      processMonthFolder(monthFolder, outputRootFolder);
    }
  });
}

// Start the process
main();

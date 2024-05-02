import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

// Function to compute the average of a row
function computeRowAverage(row) {
  let sum = 0;
  let count = 0;

  for (let i = 0; i < row.length; i++) {
    if (typeof row[i] === 'number') {
      sum += row[i];
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

// Function to process each Excel file
function processExcelFile(filePath, outputFolderPath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Compute the averages for each row
  const averages = [];
  for (let i = 3; i < data.length; i++) {
    averages.push(computeRowAverage(data[i]));
  }

  // Add the averages as a new column named "Average"
  data.forEach((row, index) => {
    if (index >= 3) {
      row.push(averages[index - 3]);
    } else {
      row.push('Average');
    }
  });

  // Write the modified data to a new Excel file
  const newSheet = xlsx.utils.aoa_to_sheet(data);
  const outputFilePath = path.join(outputFolderPath, path.basename(filePath));
  xlsx.writeFile(
    { Sheets: { Sheet1: newSheet }, SheetNames: ['Sheet1'] },
    outputFilePath,
  );
}

// Main function to start the process
function main() {
  const inputFolder = './power-2012-02'; // Path to the folder containing Excel files
  const outputFolder = './output'; // Path to the output folder

  // Create output folder if it doesn't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // Process each file in the folder
  const files = fs.readdirSync(inputFolder);
  files.forEach((file) => {
    const filePath = path.join(inputFolder, file);
    if (fs.statSync(filePath).isFile()) {
      processExcelFile(filePath, outputFolder);
    }
  });
}

// Start the process
main();

// november
//  march
// december

import fs from 'fs';
import csv from 'csv-parser';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// Input and output file paths
const inputFile = './power/SEPTEMBER.csv';
const outputFile = './POWER-FINAL/SEPTEMBER.csv';

// Read the CSV file and replace empty cells with 0
const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);
let isFirstRow = true; // Flag to track if it's the first row (header)

readStream
  .pipe(csv())
  .on('data', (row) => {
    // Iterate over each cell in the row
    Object.keys(row).forEach((key) => {
      if (!row[key]) {
        // If cell is empty, replace with 0
        row[key] = '0';
      }
    });

    // Write the modified row to the output CSV file
    if (isFirstRow) {
      // If it's the first row, write the header
      writeStream.write(Object.keys(row).join(',') + '\n');
      isFirstRow = false;
    }
    writeStream.write(Object.values(row).join(',') + '\n');
  })
  .on('end', () => {
    console.log('CSV file processing complete.');
    writeStream.end();
  })
  .on('error', (err) => {
    console.error('Error processing CSV file:', err);
  });

// Async function to handle the stream pipeline
async function processCSV() {
  try {
    await pipelineAsync(readStream, writeStream);
    console.log('CSV file processing complete.');
  } catch (err) {
    console.error('Error processing CSV file:', err);
  }
}

// Call the function to start processing the CSV file
processCSV();

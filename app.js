import fs from 'fs';
import path from 'path';
import processCsv from './processdata.js';
import combineData from '../combinedata.js';

/**
 * @param {string} directoryPath relative or absolute paths to traverse
 * @description recursively walk through all the directories and sub-directories if you encounter a .csv file process it
 */
function traverseDirectories(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        reject(err);
        return;
      }

      const promises = files.map((file) => {
        const fullPath = path.join(directoryPath, file);
        return new Promise((resolve, reject) => {
          fs.stat(fullPath, (err, stats) => {
            if (err) {
              console.error('Error getting file stats:', err);
              reject(err);
              return;
            }

            if (stats.isDirectory()) {
              traverseDirectories(fullPath).then(resolve).catch(reject);
            } else if (path.extname(file) === '.csv') {
              processCsv(fullPath);
              resolve();
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(promises).then(resolve).catch(reject);
    });
  });
}

// Start traversing from the parent directory
const parentDirectory = './2014';

async function run() {
  try {
    console.log('processing data... ');
    await traverseDirectories(parentDirectory);
    console.log('combining data... ');
    await combineData('./sorted', './processed_data');
    console.log('operation completed');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();

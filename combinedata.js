import fs from 'fs';
import path from 'path';
import combinecsv from './writesummariseddata.js';

const months = new Map([
  ['01', 'January'],
  ['02', 'Febuary'],
  ['03', 'March'],
  ['04', 'April'],
  ['05', 'May'],
  ['06', 'June'],
  ['07', 'July'],
  ['08', 'August'],
  ['09', 'September'],
  ['10', 'October'],
  ['11', 'November'],
  ['12', 'December'],
]);

export default async function combineData(parent_dir, output_dir) {
  if (!parent_dir || !output_dir) {
    console.error(
      '  Parent directory and output directory required please make sure you have provided them   ',
    );
    return;
  }

  fs.readdir(parent_dir, (error, files) => {
    if (error) {
      console.log(
        'Error traversing parent directory please make sure the dorectory  exists: ',
        error.message,
      );
    }
    files?.forEach((file) => {
      //   console.log("first");
      const fullPath = './' + path.join(parent_dir, file);

      fs.stat(fullPath, (error, stats) => {
        // console.log(file);
        if (error) {
          console.log('Error checking directory stats', error.message);
          return;
        }
        // console.log(fullPath);
        if (stats.isDirectory()) {
          combineData(fullPath, 'processed_data');
        } else {
          if (stats.isFile() && file.endsWith('.csv')) {
            // console.log(file);
            const _arrayfile = fullPath.split('/');
            const key = _arrayfile[_arrayfile.length - 2];
            const month = months.get(key);
            const newDir = output_dir + '/' + month;

            fs.mkdirSync(newDir, { recursive: true, force: true }, (err) => {
              if (err) {
                console.log('Creating directory failed: ', err);
              }
            });
            combinecsv(fullPath, `${newDir}/data.csv`);
          }
        }
      });
    });
  });
}

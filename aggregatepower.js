import fs  from  'fs';
import csv  from  'csv-parser';
import path  from  'path';


const mainFolder = './2012_csv';

fs.readdir(mainFolder, (err, months) => {
  if (err) {
    console.error('Error reading main folder:', err);
    return;
  }

  months.forEach(month => {
    const monthPath = path.join(mainFolder, month);
    const monthFile = path.join(mainFolder, `${month}.csv`);
    const monthData = {};

    fs.readdir(monthPath, (err, files) => {
      if (err) {
        console.error('Error reading month folder:', err);
        return;
      }

      files.forEach(file => {
        const day = parseInt(file.split('.')[0]);
        const filePath = path.join(monthPath, file);

        fs.createReadStream(filePath)
          .pipe(csv({ skipLines: 8 })) // Skip the first 8 rows
          .on('data', (row) => {
            const power = row['Power'];
            if (power) {
              monthData[day] = monthData[day] || [];
              monthData[day].push(power);
            }
          })
          .on('end', () => {
            // Append data to month file
            const csvData = Object.keys(monthData)
              .sort()
              .map(day => monthData[day].join(','))
              .join('\n');
            fs.writeFileSync(monthFile, Object.entries(monthData).map(([day, data]) => `${day},${data.join(',')}`).join('\n'));
          });
      });
    });
  });
});

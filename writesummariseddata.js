import fs from "fs";
import readline from "readline";
/**
 * @function combinecsv
 * @param {String} newDir
 */
export default function combinecsv(oldPath, newDir) {
  const filePath = oldPath;
  const readStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  const outputPath = newDir;
  let isNew = true;
  fs.open(outputPath, "a", (error, outputFile) => {
    if (error) {
      console.error("Error opening output file:", error);
      return;
    }

    rl.on("line", (line) => {
      if (line == `dd.MM.yyyy HH:mm, Power`) {
        return;
      }

      fs.appendFile(outputFile, `${line}\n`, (err) => {
        if (err) {
          console.error("Error appending to output file:", err);
          return;
        }
      });
    });
    rl.on("close", () => {
      fs.close(outputFile, (err) => {
        if (err) {
          console.error("Error closing output file:", err);
          return;
        }
      });
    });
  });
}

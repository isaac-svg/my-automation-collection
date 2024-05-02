import fs from "fs";

export default function createNewDir(directory) {
  let oldDir = directory.split("/");

  oldDir.splice(0, 1, "./sorted");
  oldDir.splice(oldDir.length - 1, 1);
  const newDir = oldDir.join("/");
  // console.log(newDir, "newDir");
  fs.mkdirSync(newDir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.log("Creating directory failed: ", err);
    }
  });
  return newDir;
}

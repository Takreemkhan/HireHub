import fs from "fs";
import path from "path";

export const deleteFileFromServer = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
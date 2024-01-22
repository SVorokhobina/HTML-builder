const { copyFile, mkdir, readdir, rm } = require("node:fs/promises");
const { join } = require("node:path");

const copy_folder = join(__dirname, "files-copy");
const source_folder = join(__dirname, "files");

async function createFolder(path) {
  await mkdir(path, {recursive: false});
  //console.log("A new folder is created");
}

async function copyFiles(source_path, copy_path) {
  const files = await readdir(source_path, {withFileTypes: true}, {recursive: false});
  for (const file of files) {
    const source_file = join(source_path, file.name);
    const copy_file = join(copy_path, file.name);
    await copyFile(source_file, copy_file);
  }
  //console.log("All files are successfully copied");
}

async function deleteCopyFiles(path) {
  const files = await readdir(path, {withFileTypes: true}, {recursive: false});
  if (files.length > 0) {
    //console.log("The folder is not empty, the files will be deleted")
    for (const file of files) {
      const file_path = join(path, file.name);
      await rm(file_path);
    }
  }
  //console.log("The copy folder is empty. You can start coping files");
}

createFolder(copy_folder)
  .then(() => {
    copyFiles(source_folder, copy_folder);
    //console.log("Done, files are copied");
  })
  .catch(async () => {
    //console.log("The folder already exists");
    await deleteCopyFiles(copy_folder);
    //console.log("The process of file deletion is completed");
    copyFiles(source_folder, copy_folder);
    //console.log("The copy folder is updated");
  });
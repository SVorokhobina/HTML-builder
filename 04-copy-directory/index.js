const { copyFile, mkdir, readdir, rm } = require("node:fs/promises");
const { join } = require("node:path");

const copy_folder = join(__dirname, "files-copy");
const source_folder = join(__dirname, "files");

async function createFolder(path) {
  await mkdir(path, {recursive: false});
}

async function copyFiles(source_path, copy_path) {
  const files = await readdir(source_path, {withFileTypes: true}, {recursive: false});
  for (const file of files) {
    const source_file = join(source_path, file.name);
    const copy_file = join(copy_path, file.name);
    await copyFile(source_file, copy_file);
  }
}

async function deleteCopyFiles(path) {
  const files = await readdir(path, {withFileTypes: true}, {recursive: false});
  if (files.length > 0) {
    for (const file of files) {
      const file_path = join(path, file.name);
      await rm(file_path);
    }
  }
}

createFolder(copy_folder)
  .then(() => {
    copyFiles(source_folder, copy_folder);
  })
  .catch(async () => {
    await deleteCopyFiles(copy_folder);
    copyFiles(source_folder, copy_folder);
  });
const { join } = require("node:path");
const { copyFile, mkdir, readdir, rm } = require("node:fs/promises");





async function createFolder(path) {
  await mkdir(path);
  //console.log(`createFolder: ${path}`);
}

async function clearFolder(path) {
  const files = await readdir(path, {withFileTypes: true});
  if (files.length > 0) {
    //console.log("clearFolder length != 0")
    for (const file of files) {
      const file_path = join(path, file.name);
      await rm(file_path, {recursive: true});
    }
  }
  //if (files.length === 0) {
  //  console.log("clearFolder length = 0");
  //}
}

async function copyFiles(source_path, copy_path) {
  const files = await readdir(source_path, {withFileTypes: true});
  for (const file of files) {
    const source_file = join(source_path, file.name);
    const copy_file = join(copy_path, file.name);
    if (file.isFile() === true ) {  
      await copyFile(source_file, copy_file);
      //console.log("copyFiles isFile");
    } else if (file.isDirectory() === true) {
      createFolder(copy_file);
      await copyFiles(source_file, copy_file);
      //console.log("copyFiles isDirectory");
    }
  }
  //console.log("copyFiles");
}

async function getAssets() {
  const assets_folder = join(__dirname, "project-dist", "assets");
  const source_folder = join(__dirname, "assets");
  try {
    await createFolder(assets_folder);
    //console.log("getAssets try");
  } catch {
    //console.log("getAssets catch");
    await clearFolder(assets_folder);
  } finally {
    await copyFiles(source_folder, assets_folder);
    //console.log("getAssets finally");
  }
}

async function buildProject() {
  // create the root project folder
  const project_folder = join(__dirname, "project-dist");
  try {
    await createFolder(project_folder);
    console.log("buildProject try");
  } catch {
    console.log("buildProject catch");
  } finally {
    console.log("buildProject finally");
    getAssets();
  }
}

buildProject();

/*createFolder(project_folder)
  .then(() => {
    console.log("Well done, the folder is created");
  })
  .catch(() => {
    console.log("The folder already exists");
  })
  .finally(() => {
    console.log("Works anyway");
  });*/
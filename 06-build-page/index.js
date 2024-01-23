const { join, extname } = require("node:path");
const { copyFile, mkdir, readdir, rm, writeFile } = require("node:fs/promises");
const { createReadStream, createWriteStream } = require("node:fs");

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

async function clearFile(path) {
  await writeFile(path, "", "utf8");
  console.log("clearFile");
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

async function mergeFileContent(source, output) {
  const read_stream = createReadStream(source, "utf8");
  const write_stream = createWriteStream(output, {flags: "a"}, "utf8");
  read_stream.pipe(write_stream);
  console.log("mergeFileContent");
}

/*---------- Assets ----------*/

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

/*---------- Styles ----------*/

async function getStylesheet() {
  const source_folder = join(__dirname, "styles");
  const project_folder = join(__dirname, "project-dist");
  const output_file = join(__dirname, "project-dist", "style.css");

  const project_files = await readdir(project_folder, {withFileTypes: true});
  for (const file of project_files) {
    if (file.isFile() === true && file.name === "style.css") {
      await clearFile(output_file);
    } else {
      continue;
    }
  };
  const files = await readdir(source_folder, {withFileTypes: true});
  for (const file of files) {
    const file_path = join(source_folder, file.name);
    const extension = extname(file_path);
    if (file.isFile() === true && extension === ".css") {
      await mergeFileContent(file_path, output_file);
      console.log(`getStylesheet: merge file ${file_path}`);
    }
  };
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
    await getAssets();
    await getStylesheet();
  }
}

buildProject();
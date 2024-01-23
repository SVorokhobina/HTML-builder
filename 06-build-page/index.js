const { join, extname, basename } = require("node:path");
const { copyFile, mkdir, readdir, rm, readFile, writeFile } = require("node:fs/promises");
const { createReadStream, createWriteStream } = require("node:fs");

async function createFolder(path) {
  await mkdir(path);
}

async function clearFolder(path) {
  const files = await readdir(path, {withFileTypes: true});
  if (files.length > 0) {
    for (const file of files) {
      const file_path = join(path, file.name);
      await rm(file_path, {recursive: true});
    }
  }
}

async function clearFile(path) {
  await writeFile(path, "", "utf8");
}

async function copyFiles(source_path, copy_path) {
  const files = await readdir(source_path, {withFileTypes: true});
  for (const file of files) {
    const source_file = join(source_path, file.name);
    const copy_file = join(copy_path, file.name);
    if (file.isFile() === true ) {  
      await copyFile(source_file, copy_file);
    } else if (file.isDirectory() === true) {
      createFolder(copy_file);
      await copyFiles(source_file, copy_file);
    }
  }
}

async function mergeFileContent(source, output) {
  const read_stream = createReadStream(source, "utf8");
  const write_stream = createWriteStream(output, {flags: "a"}, "utf8");
  read_stream.pipe(write_stream);
}

/*---------- Assets ----------*/

async function getAssets() {
  const assets_folder = join(__dirname, "project-dist", "assets");
  const source_folder = join(__dirname, "assets");
  try {
    await createFolder(assets_folder);
  } catch {
    await clearFolder(assets_folder);
  } finally {
    await copyFiles(source_folder, assets_folder);
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
    }
  };
}

/*---------- HTML file ----------*/

async function getHTML() {
  const template_file = join(__dirname, "template.html");
  const output_file = join(__dirname, "project-dist", "index.html");
  const project_folder = join(__dirname, "project-dist");

  const project_files = await readdir(project_folder, {withFileTypes: true});
  for (const file of project_files) {
    if (file.isFile() === true && file.name === "index.html") {
      await clearFile(output_file);
    } else {
      continue;
    }
  };
  await copyFile(template_file, output_file);
  await updateHTML();
}

async function updateHTML() {
  const components = join(__dirname, "components");
  const files = await readdir(components, {withFileTypes: true});
  let strings = [];
  for (let i = 0; i < files.length; i += 1) {
    const file_path = join(components, files[i].name);
    strings[i] = {};
    strings[i].name = basename(file_path, ".html");
    strings[i].content = await readFile(file_path, "utf8");
  };

  let regexp = /\{\{(.+)\}\}/;
  const output_file = join(__dirname, "project-dist", "index.html");
  let result_string = await readFile(output_file, "utf8");
  let replacement = "";

  while (regexp.test(result_string) === true) {
    let templ = result_string.match(regexp)[1];
    for (let i = 0; i < strings.length; i += 1) {
      if (strings[i].name === templ) {
        replacement = await strings[i].content;
      }
    }
    result_string = result_string.replace(/\{\{(.+)\}\}/, replacement);
  }
  await writeFile(output_file, result_string, "utf8");
}

async function buildProject() {
  const project_folder = join(__dirname, "project-dist");
  try {
    await createFolder(project_folder);
  } catch {
    console.log("All good, 'project-dist' folder already exists, nothing needs to be done.");
  } finally {
    await getAssets();
    await getStylesheet();
    await getHTML();
  }
}

buildProject();
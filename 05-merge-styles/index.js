const { join, extname } = require("node:path");
const { readdir, writeFile } = require("node:fs/promises");
const { createReadStream, createWriteStream } = require("node:fs");

const output_file = join(__dirname, "project-dist", "bundle.css");

async function mergeSingleFile(path) {
  const read_stream = createReadStream(path, "utf8");
  const write_stream = createWriteStream(output_file, {flags: "a"}, "utf8");
  read_stream.pipe(write_stream);
  //console.log("mergeFile completed");
}

async function clearBundle(path) {
  await writeFile(path, "", "utf8");
}

async function createBundle() {
  const source_folder = join(__dirname, "styles");
  const project_folder = join(__dirname, "project-dist");

  const project_files = await readdir(project_folder, {withFileTypes: true});
  for (const file of project_files) {
    if (file.isFile() === true && file.name === "bundle.css") {
      await clearBundle(output_file);
    } else {
      continue;
    }
  };

  const files = await readdir(source_folder, {withFileTypes: true});
  for (const file of files) {
    const file_path = join(source_folder, file.name);
    const extension = extname(file_path);
    if (file.isFile() === true && extension === ".css") {
      await mergeSingleFile(file_path);
      //console.log(`Merge file ${file_path}`);
    }
  };
}

createBundle();

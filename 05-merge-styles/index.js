const { join, extname } = require("node:path");
const { readdir } = require("node:fs/promises");
const { createReadStream, createWriteStream } = require("node:fs");
const { createInterface } = require("node:readline");

const output_file = join(__dirname, "project-dist", "bundle.css");

async function copyFileContent(path) {
  const read_stream = createReadStream(path, "utf8");
  const write_stream = createWriteStream(output_file, "utf8");
  const readline = createInterface(read_stream, write_stream);
  readline.on("line", function(line) {
    write_stream.write(line + "\n");
  }); 
  readline.on("close", function() {
    process.exit();
  });
}

/*async function sortFiles() {
  const source_folder = join(__dirname, "styles");
  let styles = [];
  const files = await readdir(source_folder, {withFileTypes: true});
  for (const file of files) {
    const file_path = join(source_folder, file.name);
    const extension = extname(file_path);
    if (file.isFile() === true && extension === ".css") {

    }
  }
} */

let new_path = join(__dirname, "styles", "style-1.css");

copyFileContent(new_path);

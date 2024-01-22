const { join, extname, basename } = require("node:path");
const { readdir, stat } = require("node:fs");
const { stdout } = require("node:process");

const folder_path = join(__dirname, "secret-folder");

readdir(folder_path, {withFileTypes: true}, function(err, files) {
  if (err) {
    stdout.write("Something is wrong with the 'readdir' method");
  }
  for (let file of files) {
    const file_path = join(folder_path, file.name);

    const extension = (file.name[0] !== ".") ? extname(file.name) :
      (extname(file.name.slice(1)) === true) ? extname(file.name.slice(1)) : "";
    const output_extension = extension.slice(1);
    const output_name = basename(file.name, extension);

    stat(file_path, function(err, stats) {
      if (err) {
        stdout.write("Something is wrong with the 'stat' method");
      }
      if (stats.isFile()) {
        const output_size = stats.size + " b";
        const output = `${output_name} - ${output_extension} - ${output_size}`;
        stdout.write(output + "\n");
      }
    });
  }
});

const path = require("path");
const fs = require("fs");

const folder_path = path.join(__dirname, "secret-folder");

fs.readdir(folder_path, {withFileTypes: true}, function(err, files) {
  for (let file of files) {
    const file_path = path.join(folder_path, file.name);

    const extension = (file.name[0] !== ".") ? path.extname(file.name) :
      (path.extname(file.name.slice(1)) === true) ? path.extname(file.name.slice(1)) : "";
    const output_extension = extension.slice(1);
    const output_name = path.basename(file.name, extension);

    fs.stat(file_path, function(err, stats) {
      if (stats.isFile()) {
        const output_size = stats.size + " b";
        const output = `${output_name} - ${output_extension} - ${output_size}`;
        console.log(output);
      }
    });
  }
});

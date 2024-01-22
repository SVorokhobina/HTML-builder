const { createReadStream } = require("node:fs");
const { join } = require("node:path");
const { stdout } = require("node:process");

const file_path = join(__dirname, "text.txt");
const result_output = [];
const read_stream = createReadStream(file_path, "utf8");

read_stream.on("data", function(chunk) {
  result_output.push(chunk); 
});

read_stream.on("end", function() {
  stdout.write(result_output.join(""));
});
const fs = require("fs");
const path = require("path");

const file_path = path.join(__dirname, "text.txt");
const result_output = [];
const read_stream = fs.createReadStream(file_path, "utf-8");

read_stream.on("data", function(chunk) {
  result_output.push(chunk); 
});

read_stream.on("end", function() {
  console.log(result_output.join(""));
});
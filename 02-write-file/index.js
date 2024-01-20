const fs = require("fs");
const path = require("path");
const { stdin: input, stdout: output } = require("node:process");
const readline = require("node:readline");

const output_file_path = path.join(__dirname, "text.txt");
const write_stream = fs.createWriteStream(output_file_path, "utf8");
const rl = readline.createInterface({ input, output });

output.write("Please, write your text below: \n");

rl.on("line", function(str) {
  if (str !== "exit") {
    write_stream.write(str + "\n");
  } else {
    rl.close();
  }  
}); 

rl.on("SIGINT", function() {
  rl.close()
});

rl.on("close", function() {
  output.write("Thank you! See you later!");
  process.exit();
});
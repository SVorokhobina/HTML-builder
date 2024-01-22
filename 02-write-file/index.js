const { createWriteStream } = require("node:fs");
const { join } = require("node:path");
const { stdin, stdout } = require("node:process");
const { createInterface } = require("node:readline");

const output_file_path = join(__dirname, "text.txt");
const write_stream = createWriteStream(output_file_path, "utf8");
const readline = createInterface(stdin, stdout);

stdout.write("Please, write your text below: \n");

readline.on("line", function(line) {
  if (line !== "exit") {
    write_stream.write(line + "\n");
  } else {
    readline.close();
  }  
}); 

readline.on("SIGINT", function() {
  readline.close()
});

readline.on("close", function() {
  stdout.write("Thank you! See you later!");
  process.exit();
});
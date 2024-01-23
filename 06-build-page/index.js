const { join } = require("node:path");
const { mkdir } = require("node:fs/promises");





async function createFolder(path) {
  await mkdir(path);
  console.log(`A new folder is created: ${path}`);
}

async function buildProject() {
  // create the root project folder
  const project_folder = join(__dirname, "project-dist");
  try {
    await createFolder(project_folder);
    console.log("Well done, the folder is created");
  } catch {
    console.log("The folder already exists");
  } finally {
    console.log("Works anyway");
  }
}

buildProject();

/*createFolder(project_folder)
  .then(() => {
    console.log("Well done, the folder is created");
  })
  .catch(() => {
    console.log("The folder already exists");
  })
  .finally(() => {
    console.log("Works anyway");
  });*/
const crypto = require('crypto');
const fs = require('fs').promises;
var path = require('path');

function hashMd5(arg) {
  try {
    return crypto.createHash('md5').update(arg).digest('hex');
  } catch (e) {
    throw new Error(e);
  }
}

function hashFolder(folder, tree = new Map(), root = folder) {
  return new Promise(async (resolve, reject) => {
    const files = await fs.readdir(folder);
    for (let file of files) {
      const filepath = path.join(root, file);
      const stats = await fs.stat(filepath);
      if (stats.isFile()) {
        const content = await fs.readFile(filepath);
        tree.set(filepath, hashMd5(content));
      } else {
        hashFolder(filepath, tree, `${root}/${file}`);
      }
    }

    console.log(tree);
    resolve(tree);
  });
}

hashFolder('test');

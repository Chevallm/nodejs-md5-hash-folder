const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

function hashMd5(arg) {
  return crypto.createHash('md5').update(arg).digest('hex');
}

async function hashFolder(folder, tree = new Map(), root = folder) {
  try {
    const files = await fs.readdir(folder);
    for (const file of files) {
      const filepath = path.join(root, file);
      const stats = await fs.stat(filepath);
      if (stats.isFile()) {
        const content = await fs.readFile(filepath);
        tree.set(filepath, hashMd5(content));
      } else {
        await hashFolder(filepath, tree, path.join(root, file));
      }
    }
    return tree;
  } catch (error) {
    throw new Error(error);
  }
}

hashFolder('test')
  .then((tree) => console.log(tree))
  .catch((error) => console.error('Error:', error));

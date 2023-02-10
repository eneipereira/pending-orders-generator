/* eslint-disable camelcase */
const fs = require('fs/promises');
const path = require('path');

const readOrder = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    const parsedContent = fileContent.split('\n').map((line) => JSON.parse(line.trim()));

    return parsedContent;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error.message);

    return [];
  }
};

const readOrders = async (dir) => {
  const folderPath = path.join(__dirname, '..', dir);

  try {
    const orders = await fs.readdir(folderPath);

    const results = await Promise.all(
      orders.map(async (order) => readOrder(`${folderPath}/${order}`)),
    );

    if (results.every((result) => result.length > 0)) return results;

    return [];
  } catch (error) {
    console.error(`Error reading files in directory ${folderPath}:`, error.message);

    return [];
  }
};

module.exports = readOrders;

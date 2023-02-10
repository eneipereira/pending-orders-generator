/* eslint-disable camelcase */
const fs = require('fs/promises');
const path = require('path');
const formatter = require('./formatter');
const verifyOrder = require('./verifyOrder');

const readOrder = async (filePath) => {
  const fileName = filePath.split('/').at(-1);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    const parsedContent = fileContent.split('\n').map((line) => JSON.parse(line.trim()));

    const formattedContent = await formatter(parsedContent);

    const result = await verifyOrder(formattedContent, fileName);

    return result;
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

    if (results.every((result) => result.length)) return results;

    return [];
  } catch (error) {
    console.error(`Error reading files in directory ${folderPath}:`, error.message);

    return [];
  }
};

module.exports = readOrders;

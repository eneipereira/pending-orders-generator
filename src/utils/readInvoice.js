/* eslint-disable camelcase */
const fs = require('fs/promises');
const path = require('path');

const readInvoice = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    const parsedContent = fileContent.split('\n').map((line) => JSON.parse(line.trim()));

    return parsedContent;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error.message);

    return [];
  }
};

const readInvoices = async (dir) => {
  const folderPath = path.join(__dirname, '..', dir);

  try {
    const invoices = await fs.readdir(folderPath);

    const results = await Promise.all(
      invoices.map(async (invoice) => readInvoice(`${folderPath}/${invoice}`)),
    );

    if (results.every((result) => result.length)) return results;

    return [];
  } catch (error) {
    console.error(`Error reading files in directory ${folderPath}:`, error.message);

    return [];
  }
};

module.exports = readInvoices;

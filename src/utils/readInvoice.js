/* eslint-disable camelcase */
const fs = require('fs/promises');
const path = require('path');
const formatter = require('./formatter');
const verifyInvoice = require('./verifyInvoice');
const readOrders = require('./readOrder');

const readInvoice = async (filePath, orders) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    const parsedContent = fileContent.split('\n').map((line) => JSON.parse(line.trim()));

    const formattedContent = await formatter(parsedContent);

    const result = await verifyInvoice(formattedContent, orders);

    return result;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error.message);

    return [];
  }
};

const readInvoices = async (dir) => {
  const folderPath = path.join(__dirname, '..', dir);
  const orders = await readOrders('db/Pedidos');

  try {
    const invoices = await fs.readdir(folderPath);

    const results = await Promise.all(
      invoices.map(async (invoice) => readInvoice(`${folderPath}/${invoice}`, orders)),
    );

    if (results.every((result) => result.length)) return results;

    return [];
  } catch (error) {
    console.error(`Error reading files in directory ${folderPath}:`, error.message);

    return [];
  }
};

module.exports = readInvoices;

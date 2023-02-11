const fs = require('fs/promises');

const writePendingOrders = async (pendingOrders) => {
  try {
    const fileContent = pendingOrders.map((order) => JSON.stringify(order, null, 2)).join(',\n');
  
    const result = await fs.writeFile('./src/pending_orders.txt', fileContent);

    if (result === undefined) {
      console.log('File successfully created!'); 
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = writePendingOrders;
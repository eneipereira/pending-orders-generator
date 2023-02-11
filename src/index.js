const { readInvoices, readOrders } = require('./utils');
const getPendingOrders = require('./utils/getPendingOrders');
const writePendingOrders = require('./utils/txtWriter');

const main = async () => {
  const pedidos = await readOrders('db/Pedidos');
  const notas = await readInvoices('db/Notas');
  const pendingOrders = await getPendingOrders(pedidos, notas);
  await writePendingOrders(pendingOrders);
};

main();
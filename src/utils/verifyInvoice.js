/* eslint-disable camelcase */
const {
  validateInvoiceTypes,
  validateInvoiceExists,
} = require('../validators');

const verifyInvoice = async (invoice, orders) => {
  const mappedInvoice = invoice.map((item) => ({
    ...item,
    id_pedido: `P${item.id_pedido}`,
  }));

  const itemResults = await Promise.all(mappedInvoice.map(async (item) => {
    const itemsResult = await validateInvoiceTypes(item);
    await validateInvoiceExists(orders, item);

    return itemsResult;
  }));

  return itemResults;
};

module.exports = verifyInvoice;
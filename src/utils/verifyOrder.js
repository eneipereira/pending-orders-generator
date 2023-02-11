/* eslint-disable camelcase */
const {
  validateOrderTypes,
  validateOrderNumberItensDuplicated, validateOrderNumberItensSequence,
} = require('../validators');

const verifyOrder = async (order, file) => {
  const [itemResults] = await Promise.all([
    await Promise.all(order.map(async (item) => validateOrderTypes(item))),
    await validateOrderNumberItensDuplicated(order),
    await validateOrderNumberItensSequence(order),
  ]);

  return itemResults.map((item) => ({
      ...item,
      id_pedido: file.split('.')[0],
      valor_unitario_produto: parseFloat(item.valor_unitario_produto.replace(',', '.')).toFixed(2),
    }));
};

module.exports = verifyOrder;
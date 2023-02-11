/* eslint-disable camelcase */
const getInvoiceItems = (invoices, id_pedido, numero_item) =>
invoices.flatMap((invoice) => 
  invoice.filter((invoiceItem) => 
    invoiceItem.id_pedido === id_pedido && invoiceItem.numero_item === numero_item));

const sumInvoiceQuantity = (invoiceItems) => 
  invoiceItems.reduce((sum, item) => sum + item.quantidade_produto, 0);

const verifyOrderItem = (orderItem, invoiceQuantity) => {
  if (invoiceQuantity > orderItem.quantidade_produto) {
    throw new Error(`Invoice quantity for item ${orderItem.id_item} exceeded order quantity`);
  }
  return orderItem.quantidade_produto - invoiceQuantity;
};

const getPendingItems = (invoice, orderItem) => {
  const { id_pedido, numero_item } = orderItem;
  const invoiceItems = getInvoiceItems(invoice, id_pedido, numero_item);
  const invoiceQuantity = sumInvoiceQuantity(invoiceItems);
  const pendingQuantity = verifyOrderItem(orderItem, invoiceQuantity);

  return pendingQuantity;
};

const getPendingOrder = (order, orderTotal, balance, pendingOrders) => {
  const pendingOrder = {
    id_pedido: order[0].id_pedido,
    valor_total: orderTotal,
    saldo_valor: balance,
    itens_pendentes: pendingOrders,
  };

  return pendingOrder;
};

const getPendingOrders = async (orders, invoice) => orders.map((order) => {
  const pendingOrders = [];
  let orderTotal = 0;
  let balance = 0;
  order.forEach((orderItem) => {
    const pendingQuantity = getPendingItems(invoice, orderItem);

    orderTotal += orderItem.valor_unitario_produto * orderItem.quantidade_produto;

    if (pendingQuantity) {
      pendingOrders.push({
        numero_item: orderItem.numero_item,
        pendingItems: pendingQuantity,
      });
      balance += pendingQuantity * orderItem.valor_unitario_produto;
    }
  });

  const pendingOrder = getPendingOrder(order, orderTotal, balance, pendingOrders);
  return pendingOrders.length ? pendingOrder : null;
}).filter((order) => order);

module.exports = getPendingOrders;

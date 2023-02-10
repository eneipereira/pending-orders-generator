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

const getPendingOrders = (orders, invoice) => orders.map((order) => {
  const pendingOrders = [];
  order.forEach((orderItem) => {
    const { id_pedido, numero_item } = orderItem;
    const invoiceItems = getInvoiceItems(invoice, id_pedido, numero_item);
    const invoiceQuantity = sumInvoiceQuantity(invoiceItems);
    const isPending = verifyOrderItem(orderItem, invoiceQuantity);

    if (isPending) pendingOrders.push(orderItem);
  });
  return pendingOrders.length ? pendingOrders : null;
}).filter((order) => order);

module.exports = getPendingOrders;

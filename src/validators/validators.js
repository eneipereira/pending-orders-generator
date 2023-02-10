/* eslint-disable camelcase */
const Joi = require('joi');
const runSchema = require('./runSchema');

const validators = {
  async validateOrderTypes(order) {
    const result = runSchema(Joi.object({
      numero_item: Joi.number().integer().positive().required(),
      codigo_produto: Joi.string().alphanum().required(),
      quantidade_produto: Joi.number().integer().positive().required(),
      valor_unitario_produto: Joi.string().regex(/^\d+(,\d{1,2})?$/).required(),
    }).messages({
      // eslint-disable-next-line max-len
      'string.pattern.base': '{{#label}} must only contain positive numbers and must have no more than 2 decimals places',
    }))(order);

    return result;
  },

  async validateOrderNumberItensDuplicated(order) {
    const set = new Set();

    if (!order.every((item) => {
      if (set.has(item.numero_item)) {
        return false;
      }
      set.add(item.numero_item);
      return true;
    })) {
      throw new Error('There are duplicated items numbers.');
    }

    return true;
  },

  async validateOrderNumberItensSequence(order) {
    for (let index = 1; index <= order.length; index += 1) {
      if (!order.find((item) => item.numero_item === index)) {
        throw new Error('"numero_item" values are not in sequence.');
      }
    }

    return true;
  },

  async validateInvoiceTypes(invoice) {
    const result = runSchema(Joi.object({
      id_pedido: Joi.string().alphanum().required(),
      numero_item: Joi.number().integer().positive().required(),
      quantidade_produto: Joi.number().integer().positive().required(),
    }))(invoice);

    return result;
  },

  async validateInvoiceExists(orders, invoice) {
    const { id_pedido, numero_item } = invoice;

    const filteredOrders = orders.flatMap(
      (order) => order.filter((item) => item.id_pedido === id_pedido),
    );

    const item = filteredOrders.find((each) => each.numero_item === numero_item);

    if (!filteredOrders.length) {
      throw new Error(`Order with "id_pedido" ${id_pedido} doesn't exist.`);
    }

    if (!item) {
      throw new Error(`Item with "numero_item" ${numero_item} doesn't exist.`);
    }

    return true;
  },
};

module.exports = validators;

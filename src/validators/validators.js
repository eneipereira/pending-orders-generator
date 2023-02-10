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

  async validateInvoiceTypes(invoice) {
    const result = runSchema(Joi.object({
      id_pedido: Joi.string().alphanum().required(),
      numero_item: Joi.number().integer().positive().required(),
      quantidade_produto: Joi.number().integer().positive().required(),
    }))(invoice);

    return result;
  },
};

module.exports = validators;

const _ = require('lodash');

const formatter = async (items) => items.map((item) => {
    const itemKeys = Object.keys(item);
    const formattedItems = {};

    itemKeys.forEach((itemKey) => {
      const formattedKey = _.deburr(itemKey);
      formattedItems[formattedKey] = item[itemKey];
    });

    return formattedItems;
  });

module.exports = formatter;

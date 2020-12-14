const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
     /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.enpossproduct.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.enpossproduct });
  },

  snipcartParser: async (ctx) => {
    let products = await strapi.services.enpossproduct.fetchAll(ctx.query);
    return products.map(product => {
        return {
        id: product._id,
        price: product.price,
        url: "https://snipcart-strapi.herokuapp.com/snipcartParser"
        }
    })
}
};

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

  snipcartparser: async (ctx) => {
    let products = await strapi.services.enpossproduct.find(ctx.query);
    console.log(products);
    return products.map(product => {
        return {
        id: product.id,
        price: product.price,
        //url: "https://snipcart-strapi.herokuapp.com/snipcartParser"
        url: "http://localhost:1337/enpossproducts/snipcartparser"
        }
    })
}
};

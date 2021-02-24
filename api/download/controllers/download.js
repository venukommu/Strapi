const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.download.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.download });
  },

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.download.search(ctx.query);
    } else {
      entities = await strapi.services.download.find(ctx.query);
    }
    entities.map(item => (
      item.names.map(val => (
        val["imgurl"] = item.images.filter(v => v.name.includes(val.image)).map(v => v.url).toString(),
        val["pdfurl"] = item.pdffiles.filter(v => v.name.includes(val.image)).map(v => v.url).toString()
      ))
    ))
    return sanitizeEntity(entities, { model: strapi.models.download });
},
};

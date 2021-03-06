const { sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
          entities = await strapi.services.carouselcontent.search(ctx.query);
        } else {
          entities = await strapi.services.carouselcontent.find(ctx.query);
        }
        entities.names.map(val => (
          val["url"] = entities.carouselimage.filter(v => v.name.includes(val.image)).map(v => v.url).toString()
        ))
        return sanitizeEntity(entities, { model: strapi.models.carouselcontent });
        //return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.carouselcontent }));
      },
};

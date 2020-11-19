const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
          entities = await strapi.services.forcepilotreport.search(ctx.query);
        } else {
          entities = await strapi.services.forcepilotreport.find(ctx.query);
        }
        return sanitizeEntity(entities, { model: strapi.models.forcepilotreport });
    },
};
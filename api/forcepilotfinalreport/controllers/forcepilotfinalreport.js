const { sanitizeEntity } = require('strapi-utils');
const _ = require('lodash');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /*async find(ctx) {
    const result = await strapi.query("forcepilotfinalreport").model.fetchAll({
      columns: ["id","Title", "subtitle","names"],
      withRelated: ["images"]
    }).then(data => {
        let output = data.toJSON();
        output = _.map(output, (item) => {
          console.log(item.images);
          let imageUrl = item.images.map(img =>(_.get(img, ['formats', 'thumbnail', 'url'])));
          item.names.map((val,key) => (
              val["url"] = imageUrl[key]
          ));
          //item.images = _.orderBy(item.images, [image => image.name], ['asc']);
          return item;
        });
        return output;
      });
    ctx.send(result)
  },*/
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.forcepilotfinalreport.search(ctx.query);
    } else {
      entities = await strapi.services.forcepilotfinalreport.find(ctx.query);
    }
    entities.names.map(val => (
      val["url"] = entities.images.filter(v => v.name.includes(val.image)).map(v => v.url).toString()
    ))

    return sanitizeEntity(entities, { model: strapi.models.portfolio });
},
}
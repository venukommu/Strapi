'use strict';

const fs = require("fs");
const path = require("path");

const {
  categories,
  products,
  homepagewidgets,
  force,
} = require("../../data/data");

//console.log(homepagewidgets);
const findPublicRole = async () => {
  const result = await strapi
    .query("role", "users-permissions")
    .findOne({
      type: "public"
    });
  return result;
};

const setDefaultPermissions = async () => {
  const role = await findPublicRole();
  const permissions_applications = await strapi
    .query("permission", "users-permissions")
    .find({
      type: "application",
      role: role.id
    });
  await Promise.all(
    permissions_applications.map(p =>
      strapi
      .query("permission", "users-permissions")
      .update({
        id: p.id
      }, {
        enabled: true
      })
    )
  );
};

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup"
  });
  const initHasRun = await pluginStore.get({
    key: "initHasRun"
  });
  await pluginStore.set({
    key: "initHasRun",
    value: true
  });
  return !initHasRun;
};

const getFilesizeInBytes = filepath => {
  var stats = fs.statSync(filepath);
  var fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
};

const createSeedData = async (files) => {

  const handleFiles = (data) => {

    var file = files.find(x => x.includes(data.slug));
    file = `./data/uploads/${file}`;

    const size = getFilesizeInBytes(file);
    const array = file.split(".");
    const ext = array[array.length - 1]
    const mimeType = `image/.${ext}`;
    const image = {
      path: file,
      name: `${data.slug}.${ext}`,
      size,
      type: mimeType
    };
    return image
  }


  const categoriesPromises = categories.map(({
    ...rest
  }) => {
    return strapi.services.category.create({
      ...rest
    });
  });

  /*const homepagewidgetsPromises = homepagewidgets.map(({
    ...rest
  }) => {
    return strapi.services.homepagewidget.create({
      ...rest
    });
  });*/
  
  const productsPromises = products.map(async product => {
    const image = handleFiles(product)

    const files = {
      image
    };

    try {
      const entry = await strapi.query('product').create(product);

      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'product'
        });
      }
    } catch (e) {
      console.log(e);
    }

  });

  await Promise.all(categoriesPromises);
  //await Promise.all(homepagewidgetsPromises);
  await Promise.all(productsPromises);
};

const widgets = async () => {
  const homepagewidgetsPromises = homepagewidgets.map(async homepagewidget => {
    try {
      await strapi.query("homepagewidget").create(homepagewidget);
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(homepagewidgetsPromises);
};

const forcedata = async () => {
  const forcePromises = force.map(async force => {
    try {
      await strapi.query("force").create(force);
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(forcePromises);
};

module.exports = async () => {
  const shouldSetDefaultPermissions = await isFirstRun();
  if (shouldSetDefaultPermissions) {
    try {
      console.log("Setting up your starter...");
      const files = fs.readdirSync(`./data/uploads`);
      await setDefaultPermissions();
      await createSeedData(files);
      await widgets();
      await forcedata();
      console.log("Ready to go");
    } catch (e) {
      console.log(e);
    }
  }
};

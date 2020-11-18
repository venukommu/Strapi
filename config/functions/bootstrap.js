'use strict';

const fs = require("fs");
const path = require("path");

const {
  categories,
  products,
  homepagewidgets,
  force,
  homebanner,
  carouselcontent,
  features,
  ourcustomers,
  downloadcontent,
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
  const handleFiles = (data) => {

    var file = files.find(x => x.includes(data.id));
    file = `./data/uploads/${file}`;
  
    const size = getFilesizeInBytes(file);
    const array = file.split(".");
    const ext = array[array.length - 1]
    const mimeType = `image/.${ext}`;
    const image = {
      path: file,
      name: `${data.id}.${ext}`,
      size,
      type: mimeType
    };
    return image
  }
  const forcePromises = force.map(async force => {
    const image = handleFiles(force)

    const files = {
      image
    };
    try {
      const entry = await strapi.query("force").create(force);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'force'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(forcePromises);
};

const carouselcontentdata = async () => {
  const carouselcontentPromises = carouselcontent.map(async carouselcontent => {
    try {
      await strapi.query("carouselcontent").create(carouselcontent);
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(carouselcontentPromises);
};   

const featurescontentdata = async () => {
  const featurescontentPromises = features.map(async features => {
    try {
      await strapi.query("features").create(features);
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(featurescontentPromises);
};   

const bannerData = async (files) => {
const handleFiles = (data) => {

  var file = files.find(x => x.includes(data.id));
  file = `./data/uploads/${file}`;

  const size = getFilesizeInBytes(file);
  const array = file.split(".");
  const ext = array[array.length - 1]
  const mimeType = `image/.${ext}`;
  const image = {
    path: file,
    name: `${data.id}.${ext}`,
    size,
    type: mimeType
  };
  return image
}
  const homebannerPromises = homebanner.map(async homebanner => {
    const bannerimage = handleFiles(homebanner)

    const files = {
      bannerimage
    };
     try {
      const entry = await strapi.query("homebanner").create(homebanner);

      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'homebanner'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(homebannerPromises);
};

const customersContentData = async () => {
  const customersDataPromises = ourcustomers.map(async ourcustomers => {
    try {
      await strapi.query("ourcustomers").create(ourcustomers);
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(customersDataPromises);
};   

const downloadContentData = async () => {
  const downloadDataPromises = downloadcontent.map(async downloadcontent => {
    try {
      await strapi.query("downloadcontent").create(downloadcontent);
    } catch (e) {
      console.log(e);
    }  
  });
  await Promise.all(downloadDataPromises);
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
      await forcedata(files);
      await bannerData(files);
      await carouselcontentdata();
      await featurescontentdata();
      await customersContentData();
      await downloadContentData();
      console.log("Ready to go");
    } catch (e) {
      console.log(e);
    }
  }
};

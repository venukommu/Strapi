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
  awesomefeatures,
  aboutcompany,
  forcesystem,
  portfolio,
  forcepilotfinalreport,
  forceenergysavingsystem,
  forcepilotreport,
  downloads,
  contacts,
} = require("../../data/data");

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
  await Promise.all(productsPromises);
};

const createContent = async (files) => {

  const handleFiles = (data) => {

    var file = files.find(x => x.includes(data.slug));
    file = `./data/uploads/${file}`;
   console.log("handleFiles",file);
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

  const handleMultipleFiles = (data) => {
    if (data.names) {
      const images = data.names.map(obj => {
        var file = files.find(x => x.includes(obj.image));
        file = `./data/uploads/${file}`;
        console.log("handleMultipleFiles",file);

        const size = getFilesizeInBytes(file);
        const array = file.split(".");
        const ext = array[array.length - 1]
        const mimeType = `image/.${ext}`;
        const image = {
            path: file,
            name: `${obj.image}.${ext}`,
            size,
            type: mimeType
        };
        return image;
      })
      return images;
    }
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
  
  const homepagewidgetsPromises = homepagewidgets.map(async homepagewidget => {
    try {
      await strapi.query("homepagewidget").create(homepagewidget);
    } catch (e) {
      console.log(e);
    }  
  });
  
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
  
  const carouselcontentPromises = carouselcontent.map(async carouselcontent => {
    const carouselimage = await handleMultipleFiles(carouselcontent)

    const files = {
      carouselimage
    };

    try {
      const entry = await strapi.query("carouselcontent").create(carouselcontent);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'carouselcontent'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });
  
  const featurescontentPromises = features.map(async features => {
    try {
      await strapi.query("features").create(features);
    } catch (e) {
      console.log(e);
    }  
  });
  
  const customersDataPromises = ourcustomers.map(async ourcustomers => {
    const image = handleFiles(ourcustomers)

    const files = {
      image
    };
    try {
      const entry = await strapi.query("ourcustomers").create(ourcustomers);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'ourcustomers'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });
  
  const downloadDataPromises = downloadcontent.map(async downloadcontent => {
    try {
      await strapi.query("downloadcontent").create(downloadcontent);
    } catch (e) {
      console.log(e);
    }  
  });

  const awesomefeaturesPromises = awesomefeatures.map(async awesomefeatures => {
    const image = handleFiles(awesomefeatures)

    const files = {
      image
    };
    try {
      const entry = await strapi.query("awesomefeatures").create(awesomefeatures);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'awesomefeatures'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });

  const aboutCompanyPromises = aboutcompany.map(async aboutcompany => {
    const bannerimage = handleFiles(aboutcompany)
    const productimage = await handleMultipleFiles(aboutcompany)

    const files = {
      bannerimage,
      productimage
    };
    try {
      const entry = await strapi.query("aboutcompany").create(aboutcompany);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'aboutcompany'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });

  const forcesystemPromises = forcesystem.map(async forcesystem => {
    const image = handleFiles(forcesystem)
    const images = await handleMultipleFiles(forcesystem)

    const files = {
      image,
      images
    };

    try {
      const entry = await strapi.query("forcesystem").create(forcesystem);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'forcesystem'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });

  const portfolioPromises = portfolio.map(async portfolio => {
    const images = await handleMultipleFiles(portfolio)

    const files = {
      images
    };

    try {
      const entry = await strapi.query("portfolio").create(portfolio);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'portfolio'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });

  const forcepilotfinalPromises = forcepilotfinalreport.map(async forcepilotfinalreport => {
    const images = await handleMultipleFiles(forcepilotfinalreport)

    const files = {
      images
    };

    try {
      const entry = await strapi.query("forcepilotfinalreport").create(forcepilotfinalreport);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'forcepilotfinalreport'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });

  const energysavingsystemPromises = forceenergysavingsystem.map(async forceenergysavingsystem => {
    const images = await handleMultipleFiles(forceenergysavingsystem)

    const files = {
      images
    };

    try {
      const entry = await strapi.query("forceenergysavingsystem").create(forceenergysavingsystem);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'forceenergysavingsystem'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });
  
  const forcepilotreportPromises = forcepilotreport.map(async forcepilotreport => {
    const images = await handleMultipleFiles(forcepilotreport)

    const files = {
      images
    };

    try {
      const entry = await strapi.query("forcepilotreport").create(forcepilotreport);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'forcepilotreport'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });

  const downloadPromises = downloads.map(async download => {
    const images = await handleMultipleFiles(download)

    const files = {
      images
    };

    try {
      const entry = await strapi.query("download").create(download);
      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'download'
        });
      }
    } catch (e) {
      console.log(e);
    }  
  });
  
  const contactsPromises = contacts.map(async contact => {
    const images = handleFiles(contact)

    const files = {
      images
    };

    try {
      const entry = await strapi.query('contact').create(contact);

      if (files) {
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'contact'
        });
      }
    } catch (e) {
      console.log(e);
    }

  });

  await Promise.all(homebannerPromises);
  await Promise.all(homepagewidgetsPromises);
  await Promise.all(forcePromises);
  await Promise.all(carouselcontentPromises);
  await Promise.all(featurescontentPromises);
  await Promise.all(customersDataPromises);
  await Promise.all(downloadDataPromises);
  await Promise.all(awesomefeaturesPromises);
  await Promise.all(aboutCompanyPromises);
  await Promise.all(forcesystemPromises);
  await Promise.all(portfolioPromises);
  await Promise.all(forcepilotfinalPromises);
  await Promise.all(energysavingsystemPromises);
  await Promise.all(forcepilotreportPromises);
  await Promise.all(downloadPromises);
  await Promise.all(contactsPromises);
};

module.exports = async () => {
  const shouldSetDefaultPermissions = await isFirstRun();
  if (shouldSetDefaultPermissions) {
    try {
      console.log("Setting up your starter...");
      const files = fs.readdirSync(`./data/uploads`);
      await setDefaultPermissions();
      await createSeedData(files);
      await createContent(files);
      console.log("Ready to go");
    } catch (e) {
      console.log(e);
    }
  }
};

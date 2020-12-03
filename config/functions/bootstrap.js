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

const createContent = async (files, pdfs) => {
  const getimage = (file, objname) => {
    const size = getFilesizeInBytes(file);
    const array = file.split(".");
    const ext = array[array.length - 1]
    const mimeType = `image/.${ext}`;
    const image = {
        path: file,
        name: `${objname}.${ext}`,
        size,
        type: mimeType
    };
    return image;
  }
  const handleFiles = (data) => {
    var file = files.find(x => x.includes(data.slug));
    file = `./data/uploads/${file}`;
    return getimage(file, data.slug)
  }
  const handleMultipleFiles = (data) => {
    if (data.names) {
      const images = data.names.map(obj => {
        var file = files.find(x => x.includes(obj.image));
        file = `./data/uploads/${file}`;
        return getimage(file, obj.image)
      })
      return images;
    }
  }
  const handleMultiplepdfs = (data) => {
    if (data.names) {
      const pdfimages = data.names.map(obj => {
        if (obj.pdfimage) {
          var file = pdfs.find(x => x.includes(obj.pdfimage));
          file = `./data/uploads/pdf-reports/${file}`;
          return getimage(file, obj.pdfimage)
        }
      })
      return pdfimages;
    }
  }

  const promisesData = async (images, data, modelname) => {
     try {
      const entry = await strapi.query(modelname).create(data);

      if (files) {
        await strapi.entityService.uploadFiles(entry, images, {
          model: modelname
        });
      }
    } catch (e) {
      console.log(e);
    }  
  }
  const homebannerPromises = homebanner.map(async homebanner => {
    const bannerimage = handleFiles(homebanner)
    const files = {
      bannerimage
    };
    await promisesData(files, homebanner, "homebanner")
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
    await promisesData(files, force, "force")
  });
  
  const carouselcontentPromises = carouselcontent.map(async carouselcontent => {
    const carouselimage = await handleMultipleFiles(carouselcontent)

    const files = {
      carouselimage
    };
    await promisesData(files, carouselcontent, "carouselcontent")
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
    await promisesData(files, ourcustomers, "ourcustomers")
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
    await promisesData(files, awesomefeatures, "awesomefeatures")
  });

  const aboutCompanyPromises = aboutcompany.map(async aboutcompany => {
    const bannerimage = handleFiles(aboutcompany)
    const productimage = await handleMultipleFiles(aboutcompany)

    const files = {
      bannerimage,
      productimage
    };
    await promisesData(files, aboutcompany, "aboutcompany")
  });

  const forcesystemPromises = forcesystem.map(async forcesystem => {
    const image = handleFiles(forcesystem)
    const images = await handleMultipleFiles(forcesystem)

    const files = {
      image,
      images
    };
    await promisesData(files, forcesystem, "forcesystem")
  });

  const portfolioPromises = portfolio.map(async portfolio => {
    const images = await handleMultipleFiles(portfolio)

    const files = {
      images
    };
    await promisesData(files, portfolio, "portfolio")
  });

  const forcepilotfinalPromises = forcepilotfinalreport.map(async forcepilotfinalreport => {
    const images = await handleMultipleFiles(forcepilotfinalreport)

    const files = {
      images
    };
    await promisesData(files, forcepilotfinalreport, "forcepilotfinalreport")
  });

  const energysavingsystemPromises = forceenergysavingsystem.map(async forceenergysavingsystem => {
    const images = await handleMultipleFiles(forceenergysavingsystem)

    const files = {
      images
    };
    await promisesData(files, forceenergysavingsystem, "forceenergysavingsystem")
  });
  
  const forcepilotreportPromises = forcepilotreport.map(async forcepilotreport => {
    const images = await handleMultipleFiles(forcepilotreport)

    const files = {
      images
    };
    await promisesData(files, forcepilotreport, "forcepilotreport")  
  });

  const downloadPromises = downloads.map(async download => {
    const images = await handleMultipleFiles(download)
    const pdffiles = await handleMultiplepdfs(download)

    const files = {
      images,
      pdffiles
    };
    await promisesData(files, download, "download")  
  });
  
  const contactsPromises = contacts.map(async contact => {
    const images = handleFiles(contact)

    const files = {
      images
    };
    await promisesData(files, contact, "contact")
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
      const pdfs = fs.readdirSync(`./data/uploads/pdf-reports`);
      await setDefaultPermissions();
      await createSeedData(files);
      await createContent(files, pdfs);
      console.log("Ready to go");
    } catch (e) {
      console.log(e);
    }
  }
};

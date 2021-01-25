"use strict";

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

const stripe = require("stripe")("sk_test_5W7bYFge8U2bQd7at2LsoI4d");

module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    //console.log(ctx.request.body);
    const { product, token } =  ctx.request.body;

    // charge on stripe
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id 
      })
      const charge = await stripe.charges.create({
      // Transform cents to dollars.
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "All Products Description",
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.country,
            postal_code: token.card.address_zip
          }
        }
    });
    //console.log(charge);
    // Register the order in the database
    try {
      const order = await strapi.services.order.create({
        //user: ctx.state.user.id,
        charge_id: charge.id,
        name: token.card.name,
        amount: charge.amount,
        city: token.card.address_city,
        state: token.card.address_state,
        token: token.id,
        status: charge.status,
        billingaddress: charge.billing_details.address,
        shippingaddress: charge.shipping.address
      });
      //console.log("responce",ctx);
      return order;
    } catch (err) {
      console.log('order error: ', err);
    }
  } catch (err) {
    console.log('stripe error: ', err);
    ctx.response.status = 400;
    ctx.response.message = err.raw.message;
    ctx.response.body = err;
    return ctx.response;
    }
  },
};


 
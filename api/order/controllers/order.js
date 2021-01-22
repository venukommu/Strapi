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
      console.log(ctx.request.body);
    const { address, amount, token, city, state } = 
      ctx.request.body;
   
    const stripeAmount = amount;
    // charge on stripe
    try {
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount * 100,
      currency: "usd",
      //description: `Order ${new Date()} by ${ctx.state.user._id}`,
      description: "First Test Charge",
      source: token,
    });
    console.log(charge);
    // Register the order in the database
    try {
    const order = await strapi.services.order.create({
      //user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      city,
      state,
      token,
      status: charge.status
    });
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


 
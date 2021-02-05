module.exports = {
    send: async ctx => {
        await strapi.plugins['email'].services.email.send({
            to: 'madhulika@baylogictech.com',
            from: 'madhulika@baylogictech.com',
            replyTo: 'madhulika@baylogictech.com',
            subject: 'Use strapi email provider successfully',
            text: 'Hello world!',
            html: 'Hello world!',
        });
       ctx.send('Hello World!3');
    },
};
module.exports = ({ env }) => ({
    // ...
    email: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'madhulika@baylogictech.com',
        defaultReplyTo: 'madhulika@baylogictech.com',
      },
    },
    // ...
  });
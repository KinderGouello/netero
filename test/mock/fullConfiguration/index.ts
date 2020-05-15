export default {
  parameters: {
    'mailer.transport': 'sendmail',
  },
  services: {
    newsletterManager: {
      path: 'mock/fullConfiguration/manager/NewsletterManager',
      arguments: ['@mailer'],
    },
    mailer: {
      path: 'mock/fullConfiguration/service/Mailer',
      arguments: ['%mailer.transport%'],
    },
  },
};

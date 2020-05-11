export default {
  parameters: {
    'mailer.transport': 'sendmail',
  },
  services: {
    'mock/fullConfiguration/manager/NewsletterManager': {
      arguments: ['@mock.fullConfiguration.service.Mailer'],
    },
    'mock/fullConfiguration/service/Mailer': {
      arguments: ['%mailer.transport%'],
    },
  },
};

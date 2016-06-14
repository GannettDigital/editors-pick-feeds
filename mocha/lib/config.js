module.exports = function () {

    var config = {
        syndication: {
            host: 'api.gannett-cdn.com/syndication/assets/',
            web_application: 'SyndicationAPI'
        },
        email: {
            host: 'Relay.ent.gci',
            authUser: 'mobileops@gannett.com',
            authPwd: 'g@nn3tm0b1l30psc1',
            allNewsOwner: {email: 'cmrichards@usatoday.com', name: 'Cara Richardson'},
            businessOwner: {email: 'dcarrig@usatoday.com', name: 'David Carrig'},
            technologyOwner: {email: 'lmandaro@usatoday.com', name: 'Laura Mandaro'},
            admin: {email: 'klingga@gannett.com', name: 'Kal Lingga'},
            automation: {email: 'automation@gannett.com', name: 'Gannett Automation'},
            subject: 'Editors\' Pick feeds',
            messageBody: '<p>Hi <b>{0}</b>, <br><br>The <i>{1}</i> feed has not been updated in the last 48 hours. Because of this, Google will not feature our feeds on Google News search.<br><br>' +
            'Please take a moment to add the appropriate "Google Editors Pick" tag to a story you\'d like to have featured on Google News and then publish that story.<br><br>Thank you!</p>',
            adminMessage: '<p>All feeds have at least one story within 48 hours</p>'
        },
        feed: {
            tags: ['Google Editors Pick All News', 'Google Editors Pick Business', 'Google Editors Pick Technology'],
            apiKey: '66a8862b49dfc0b2d096c7ff408abdbc'
        }
    };

    return config;
};
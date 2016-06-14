'use strict';

var chai = require('chai');
chai.use(require('chai-json-schema'));
var format = require('string-format');
var parseNITFXML = require('xml2js').parseString;
var nodemailer = require("nodemailer");

var SyndicationAssetsClient = require('../lib/syndication-assets.js');
var Config = require('../lib/config.js');

var config = new Config();
var syndicationAssetsClient = new SyndicationAssetsClient(config);
var nowDate = new Date();

var host = config.email.host;
var user = config.email.authUser;
var pass = config.email.authPwd;
var subject = config.email.subject;
var tags = config.feed.tags;
var apiKey = config.feed.apiKey;

var returnedFeed = {};
var messageBody;
var emailSent = false;

tags.forEach(function (tag) {
    describe('Get syndication assets & validate at least one assets was created in the last 48 hours', function () {
        this.timeout(0);

        before(function (done) {
            syndicationAssetsClient.getSyndicationAssetsTags(apiKey, tag, function (error, response, body) {
                parseNITFXML(body, function (err, feed) {
                    if (err) {
                        throw err;
                    }
                    else {
                        returnedFeed = feed;
                    }
                });
                done();
            });
        });

        it('feed should validate \'' + tag + '\' tag', function (done) {
            var greaterThan48 = 0;
            var items = returnedFeed.rss.channel[0].item;

            items.forEach(function (item) {
                var itemPubDate = new Date(item.pubDate[0]);
                if (parseInt((nowDate.getTime() - itemPubDate.getTime()) / (3600 * 1000)) >= 48) {
                    greaterThan48++;
                }
                //console.log('Hours since this feed item was updated: ' + parseInt((nowDate.getTime() - itemPubDate.getTime()) / (3600 * 1000)))

            });

            // create a transport
            var smtpTransport = nodemailer.createTransport("SMTP", {
                host: host,
                secure: true,
                auth: {
                    user: user,
                    pass: pass
                }
            });

            // select the correct owner for the executed tag
            var to = {
                'Google Editors Pick All News': config.email.allNewsOwner,
                'Google Editors Pick Business': config.email.businessOwner,
                'Google Editors Pick Technology': config.email.technologyOwner,
                'None': config.email.admin
            };

            // if the number of items that was created beyond 48 hours select the appropriate message
            if (greaterThan48 === items.length) {
                messageBody = config.email.messageBody;
                emailSent = false;
            }
            else {
                tag = 'None';
                messageBody = config.email.adminMessage;
            }

            var mailOptions = {
                from: user,
                to: to[tag].email + ', ' + config.email.automation.email,
                subject: subject,
                html: format(messageBody, to[tag].name, tag)
            };

            // if tag feed owner was not sent an email, send an email
            // and if an admin email was send, don't send another one
            if (emailSent === false) {
                smtpTransport.sendMail(mailOptions, function (error) {
                    if (error) {
                        done();
                        return console.log('sendMail error' + error);
                    }
                    emailSent = true;
                    console.log('Email message sent to: ' + to[tag].email + ', ' + config.email.automation.email);
                    done();
                });
            }
            else {
                done();
            }
        });
    });
});
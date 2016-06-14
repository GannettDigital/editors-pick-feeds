var request = require('request');
var format = require('string-format');

module.exports = (function () {
    function GetSyndicationAssets(config) {
        var client = {};
        var baseSiteUrl = 'http://' + config.syndication.host;
        var GET_SYNDICATION_ASSETS_ENDPOINT_TAGS = '{0}?apiKey={1}&tag=\"{2}\"';

        client.getSyndicationAssetsTags = function (apiKey, tag, onResult) {
            var getSyndicationAssetsURL = format(GET_SYNDICATION_ASSETS_ENDPOINT_TAGS, baseSiteUrl, apiKey, tag);
            request.get(getSyndicationAssetsURL, onResult);
        };

        return client;
    }

    return GetSyndicationAssets;
})();
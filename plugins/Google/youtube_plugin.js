var util = require('util');
var youtube_node = require('youtube-node');

	var AuthDetails = {
		'client_id':process.env.BOT_ID,
		'bot_token':process.env.BOT_TOKEN,
		'wolfram_api_key':process.env.WOLFRAM_API_KEY,
		'youtube_api_key':process.env.YOUTUBE_API_KEY
		};


function YoutubePlugin () {
	this.RickrollUrl = 'http://www.youtube.com/watch?v=oHg5SJYRHA0';
	this.youtube = new youtube_node();
	this.youtube.setKey(AuthDetails.youtube_api_key);
	this.youtube.addParam('type', 'video');
};


YoutubePlugin.prototype.respond = function (query, channel, bot) {
	this.youtube.search(query, 1, function(error, result) {
			if (error) {
				channel.send("¯\\_(ツ)_/¯");
			}
			else {
				if (!result || !result.items || result.items.length < 1) {
					channel.send("¯\\_(ツ)_/¯");
				} else {
					channel.send("http://www.youtube.com/watch?v=" + result.items[0].id.videoId );
				}
			}
		});

};


module.exports = YoutubePlugin;

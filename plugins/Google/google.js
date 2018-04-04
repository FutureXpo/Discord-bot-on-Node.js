var request = require("request");
	var AuthDetails = {
		'google_custom_search':process.env.GOOGLE_CUSTOM_SEARCH,
		'youtube_api_key':process.env.YOUTUBE_API_KEY
		};
try {
	var yt = require("./youtube_plugin");
	var youtube_plugin = new yt();
} catch(e){
	console.log("couldn't load youtube plugin!\n"+e.stack);
}

exports.commands = [
	"image", //gives top image from google search
	"rimage", //gives random image from google search
	"ggif", //gives random gif from google search
	"youtube"
];

exports.image = {
	usage: "[Текст]",
	description: "Возвращает картинку из гугла по запросу",
	process: function(bot, msg, args) {
		if(!AuthDetails || !AuthDetails.youtube_api_key || !AuthDetails.google_custom_search){
			msg.channel.send("Разработчик бота еще не доделал эту функцию!");
			return;
		}
		//gets us a random result in first 5 pages
		var page = 1; //we request 10 items
		request("https://www.googleapis.com/customsearch/v1?key=" + AuthDetails.youtube_api_key + "&cx=" + AuthDetails.google_custom_search + "&q=" + (args.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start="+page, function(err, res, body) {
			var data, error;
			try {
				data = JSON.parse(body);
			} catch (error) {
				console.log(error)
				return;
			}
			if(!data){
				console.log(data);
				msg.channel.send( "Ошибка:\n" + JSON.stringify(data));
				return;
			}
			else if (!data.items || data.items.length == 0){
				console.log(data);
				msg.channel.send( "Нет результатов по запросу '" + args + "'");
				return;
			}
			var randResult = data.items[0];
			msg.channel.send( randResult.title + '\n' + randResult.link);
		});
	}
}

exports.rimage = {
	usage: "[Текст]",
	description: "Возвращает случайную картинку из гугла по запросу",
	process: function(bot, msg, args) {
		if(!AuthDetails || !AuthDetails.youtube_api_key || !AuthDetails.google_custom_search){
			msg.channel.send( "Разработчик бота еще не доделал эту функцию!");
			return;
		}
		//gets us a random result in first 5 pages
		var page = 1 + Math.floor(Math.random() * 5) * 10; //we request 10 items
		request("https://www.googleapis.com/customsearch/v1?key=" + AuthDetails.youtube_api_key + "&cx=" + AuthDetails.google_custom_search + "&q=" + (args.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start="+page, function(err, res, body) {
			var data, error;
			try {
				data = JSON.parse(body);
			} catch (error) {
				console.log(error)
				return;
			}
			if(!data){
				console.log(data);
				msg.channel.send( "Ошибка:\n" + JSON.stringify(data));
				return;
			}
			else if (!data.items || data.items.length == 0){
				console.log(data);
				msg.channel.send("Нет результатов по запросу: '" + args + "'");
				return;
			}
			var randResult = data.items[Math.floor(Math.random() * data.items.length)];
			msg.channel.send( randResult.title + '\n' + randResult.link);
		});
	}
}

exports.ggif = {
	usage : "[Текст]",
	description : "Возвращает гифку из гугла по запросу",
	process : function(bot, msg, args) {
		//gets us a random result in first 5 pages
		var page = 1 + Math.floor(Math.random() * 5) * 10; //we request 10 items
		request("https://www.googleapis.com/customsearch/v1?key=" + AuthDetails.youtube_api_key + "&cx=" + AuthDetails.google_custom_search + "&q=" + (args.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start="+page+"&fileType=gif", function(err, res, body) {
			var data, error;
			try {
				data = JSON.parse(body);
			} catch (error) {
				console.log(error)
				return;
			}
			if(!data){
				console.log(data);
				msg.channel.send( "Ошибка:\n" + JSON.stringify(data));
				return;
			}
			else if (!data.items || data.items.length == 0){
				console.log(data);
				msg.channel.send( "Нет результатов по запросу: '" + args + "'");
				return;
			}
			var randResult = data.items[Math.floor(Math.random() * data.items.length)];
			msg.channel.send( randResult.title + '\n' + randResult.link);
		});

	}
}

exports.youtube = {
	usage: "[Текст]",
	description: "Выдает видео из ютуба по запросу",
	process: function(bot,msg,suffix){
		youtube_plugin.respond(suffix,msg.channel,bot);
	}
}
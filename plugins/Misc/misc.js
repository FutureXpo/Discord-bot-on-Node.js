var request = require("request");

exports.commands = [
//	"watchtogether",
	"talk",
	"clear"
]

//Простые команды

exports.watchtogether = {
	usage: "[Ссылка на видео(Youtube, Vimeo)]",
	description: "Создает комнату, чтобы смотреть видосик одновременно!",
	process: function(bot,msg,suffix){
		var watch2getherUrl = "https://www.watch2gether.com/go#";
		msg.channel.send(
			"Ссылка:").then(function(){
				msg.channel.send(watch2getherUrl + suffix)
		})
	}
}

exports.talk = {
	usage: "[Текст]",
	description: "Общаться с ботом!",
	process: function(bot,msg,suffix){
		const chat_text = suffix;
		var data={
			'input'  : chat_text,
			'botcust2' : 'e5b0bfbd9e35edae'
		}	
		var options = {
			url: 'http://sheepridge.pandorabots.com/pandora/talk?botid=b69b8d517e345aba&skin=custom_input',
			method: 'POST',
			form: data
		}
		if(!(!chat_text || 0 === chat_text.length))
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var text = body.toString();
				msg.delete().catch(O_o=>{});  
				msg.channel.send(`
You: `+chat_text+`
Me : `+text.substring(text.lastIndexOf('<br>')+14));
			} else console.error(error);
		})
	}
}

exports.clear = {
	usage: "[Число]",
	description: "Очищает до 100 сообщенией",
	process: function(bot,msg,suffix){
		if (suffix==='')
			return msg.channel.fetchMessages({limit: 100})
				.then(messages => messages.deleteAll())
				.catch(console.error);
		const deleteCount = parseInt(suffix)+1;
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return msg.reply("Пожалуйста, используйте число от 1 до 99. Иначе слишком сложнаааа...");
		return msg.channel.fetchMessages({limit: deleteCount})
			.then(messages => messages.deleteAll())
			.catch(console.error);
	}
}
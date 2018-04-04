exports.commands = [
	"watchtogether",
	"talk"
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
		var data={
			'input'  : chat_text,
			'botcust2' : 'e5b0bfbd9e35edae'
		}	
		var options = {
			url: 'http://sheepridge.pandorabots.com/pandora/talk?botid=b69b8d517e345aba&skin=custom_input',
			method: 'POST',
			form: data
		}
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var text = body.toString();
				msg.delete().catch(O_o=>{});  
				msg.channel.send(`
You: `+chat_text+`
Me : `+text.substring(text.lastIndexOf('<br>')+14));
			}
		})
	}
}

exports.clear = {
	usage: "[Число]",
	description: "Очищает до 100 сообщенией",
	process: function(bot,msg,suffix){
		const args = msg.content.slice(Config.commandPrefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if (msg.content===Config.commandPrefix+command)
			return msg.channel.fetchMessages({limit: 100})
				.then(messages => messages.deleteAll())
				.catch(console.error);
		const deleteCount = parseInt(args[0], 10)+1;
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return msg.reply("Пожалуйста, используйте число от 1 до 99. Иначе слишком сложнаааа...");
		return msg.channel.fetchMessages({limit: deleteCount})
			.then(messages => messages.deleteAll())
			.catch(console.error);
	}
}
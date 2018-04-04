exports.commands = [
	"watchtogether"
]

//Простые команды

exports.watchtogether = {
	usage: "[Ссылка на видео(Youtube, Vimeo)",
	description: "Создает комнату, чтобы смотреть видосик одновременно!",
	process: function(bot,msg,suffix){
		var watch2getherUrl = "https://www.watch2gether.com/go#";
		msg.channel.send(
			"Ссылка:").then(function(){
				msg.channel.send(watch2getherUrl + suffix)
		})
	}
}

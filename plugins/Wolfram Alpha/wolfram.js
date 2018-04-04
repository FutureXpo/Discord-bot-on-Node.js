exports.commands = [
	"wolfram"
]

var wa = require("./wolfram_plugin");
var wolfram_plugin = new wa();

exports.wolfram = {
	usage: "[Запрос]",
	description: "С помощью wolframalpha решает примеры",
	process: function(bot,msg,suffix){
		if(!suffix){
			msg.channel.send("Использование: " + Config.commandPrefix + "wolfram <запрос> (Например " + Config.commandPrefix + "wolfram integrate 4x)");
		}
		msg.channel.send("*Ожидание Wolfram Alpha...*").then(message => {
			wolfram_plugin.respond(suffix,msg.channel,bot,message);
		});
	}
}

exports.commands = [
	"setUsername",
	"log",
	"uptime"
]

var startTime = Date.now();

exports.setUsername = {
	description: "Установить имя боту. Работает не чаще двух раз в час!",
	process: function(bot,msg,suffix) {bot.user.setUsername(suffix);}
}

exports.log = {
	usage: "[Cообщение]",
	description: "Пишет сообщение в консоли бота",
	process: function(bot,msg,suffix){console.log(msg.content);}
}

exports.uptime = {
	usage: "",
	description: "Говорит сколько времени работает бот с последнего запуска",
	process: function(bot,msg,suffix){
		var now = Date.now();
		var msec = now - startTime;
		console.log("Uptime is " + msec + " milliseconds");
		var days = Math.floor(msec / 1000 / 60 / 60 / 24);
		msec -= days * 1000 * 60 * 60 * 24;
		var hours = Math.floor(msec / 1000 / 60 / 60);
		msec -= hours * 1000 * 60 * 60;
		var mins = Math.floor(msec / 1000 / 60);
		msec -= mins * 1000 * 60;
		var secs = Math.floor(msec / 1000);
		var timestr = "";
		if(days > 0) {
			timestr += days + " д. ";
		}
		if(hours > 0) {
			timestr += hours + " ч. ";
		}
		if(mins > 0) {
			timestr += mins + " м. ";
		}
		if(secs > 0) {
			timestr += secs + " с. ";
		}
		msg.channel.send("**Время работы**: " + timestr);
	}
}

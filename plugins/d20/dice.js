exports.commands = [
	"roll"
]

var d20 = require('d20')

exports.roll = {
	usage: "[Число]",
	description: "Выдает случайное число",
	process: function(bot,msg,suffix) {
		if (suffix.split("d").length <= 1) {
			msg.channel.send(msg.author + " rolled a " + d20.roll(suffix || "10"));
		}
		else if (suffix.split("d").length > 1) {
			var eachDie = suffix.split("+");
			var passing = 0;
			for (var i = 0; i < eachDie.length; i++){
				if (eachDie[i].split("d")[0] < 50) {
					passing += 1;
				};
			}
			if (passing == eachDie.length) {
				msg.channel.send(msg.author + " выкинул(а) " + d20.roll(suffix));
			}  else {
				msg.channel.send(msg.author + " кинул(а) слишком много кубиков!");
			}
		}
	}
}

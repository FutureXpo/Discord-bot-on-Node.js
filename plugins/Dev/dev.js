exports.commands = [
	"pullanddeploy",
	"version",
	"myid",
	"userid"
]

//a collection of commands primarily useful for developers

exports.pullanddeploy = {
	description: "bot will perform a git pull master and restart with the new code",
	process: function(bot,msg,suffix) {
		msg.channel.send("fetching updates...").then(function(sentMsg){
			console.log("updating...");
			var spawn = require('child_process').spawn;
			var log = function(err,stdout,stderr){
				if(stdout){console.log(stdout);}
				if(stderr){console.log(stderr);}
			};
			var fetch = spawn('git', ['fetch']);
			fetch.stdout.on('data',function(data){
				console.log(data.toString());
			});
			fetch.on("close",function(code){
				var reset = spawn('git', ['reset','--hard','origin/master']);
				reset.stdout.on('data',function(data){
					console.log(data.toString());
				});
				reset.on("close",function(code){
					var npm = spawn('npm', ['install']);
					npm.stdout.on('data',function(data){
						console.log(data.toString());
					});
					npm.on("close",function(code){
						console.log("goodbye");
						sentMsg.edit("brb!").then(function(){
							bot.destroy().then(function(){
								process.exit();
							});
						});
					});
				});
			});
		});
	}
}

exports.version = {
	description: "Называет текущую версию бота",
	process: function(bot,msg,suffix) {
		msg.channel.send("Текущая версия бота: " + process.env.BOT_VERSION);
	}
}

exports.myid = {
	description: "Возвращает id человека",
	process: function(bot,msg){
		msg.channel.send(msg.author.id);
	}
}

exports.userid = {
	usage: "[Никнейм]",
	description: "Возвращает id человека ",
	process: function(bot,msg,suffix) {
		if(msg.mentions.members.size > 0){
			if(msg.mentions.members.size > 1){
				var response = "Найдено несколько людей с таким ником:";
				for(id of msg.mentions.members.keys()){
					response += "\nId <@" + id + "> - " + id;
				}
				msg.channel.send(response);
			} else {
				let id = msg.mentions.members.firstKey();
				msg.channel.send("\nId <@" + id + "> - " + id);
			}
		} else if(suffix){
			var users = msg.channel.guild.members.filter((member) => member.user.username == suffix).array();
			if(users.length == 1){
				msg.channel.send( "Id " + users[0].user.username + " - " + users[0].user.id)
			} else if(users.length > 1){
				var response = "Найдено несколько людей с таким ником:";
				for(var i=0;i<users.length;i++){
					var user = users[i];
					response += "\nId <@" + user.id + "> - " + user.id;
				}
				msg.channel.send(response);
			} else {
				msg.channel.send("Не найдено людей с ником " + suffix);
			}
		} else {
			msg.channel.send( "Id " + msg.author + " - " + msg.author.id);
		}
	}
}


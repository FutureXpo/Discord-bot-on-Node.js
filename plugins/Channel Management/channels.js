exports.commands = [
	"create",
	"voice",
	"delete",
	"servers",
	"topic"
]

exports.create = {
	usage: "<Название>",
	description: "Создает текстовый канал с заданным именем",
	process: function(bot,msg,suffix) {
		msg.channel.guild.createChannel(suffix,"text").then(function(channel) {
			msg.channel.send("Создан! " + channel);
		}).catch(function(error){
			msg.channel.send("failed to create channel: " + error);
		});
	}
}

exports.servers = {
description: "Выводит все коналы бота",
process: function(bot,msg) {
	msg.channel.send(`__**${bot.user.username} запущен на следующих серверах:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
}
},

exports.voice = {
	usage: "<Название>",
	description: "Создает голосовой канал с заданным именем",
	process: function(bot,msg,suffix) {
		msg.channel.guild.createChannel(suffix,"voice").then(function(channel) {
			msg.channel.send("Создан! " + channel.id);
			console.log("created " + channel);
		}).catch(function(error){
			msg.channel.send("failed to create channel: " + error);
		});
	}
},

exports["delete"] = {
	usage: "<Название>",
	description: "Удаляет выбранный канал",
	process: function(bot,msg,suffix) {
		var channel = bot.channels.get(suffix);
		if(suffix.startsWith('<#')){
			channel = bot.channels.get(suffix.substr(2,suffix.length-3));
		}
		if(!channel){
			var channels = msg.channel.guild.channels.findAll("name",suffix);
			if(channels.length > 1){
				var response = "Существует несколько каналов с выбранным именем, выберите один:";
				for(var i=0;i<channels.length;i++){
					response += channels[i] + ": " + channels[i].id;
				}
				msg.channel.send(response);
				return;
			}else if(channels.length == 1){
				channel = channels[0];
			} else {
				msg.channel.send( "Не могу найти чат " + suffix + " !");
				return;
			}
		}
		msg.channel.guild.defaultChannel.send("Удален канал " + suffix + " по запросу " + msg.author);
		if(msg.channel.guild.defaultChannel != msg.channel){
			msg.channel.send("Удаление " + channel);
		}
		channel.delete().then(function(channel){
			console.log("deleted " + suffix + " at " + msg.author + "'s request");
		}).catch(function(error){
			msg.channel.send("Не могу удалить чат по следующей причине: " + error);
		});
	}
}

exports.topic = {
	usage: "[Текст заголовка]",
	description: 'Устанавливает заголовок канала. Пустая строка убирает заголовок',
	process: function(bot,msg,suffix) {
		msg.channel.setTopic(suffix);
	}
}

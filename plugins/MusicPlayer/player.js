const yt = require('ytdl-core');
var request1 = require('superagent');

const API_KEY = process.env.YOUTUBE_API_KEY;
const WATCH_VIDEO_URL = "https://www.youtube.com/watch?v=";

let queue = {};

const commands = {
	'play_': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Добавьте больше песен в список с помощью команды \'${process.env.PREFIX}play\'`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play_(msg));
		if (queue[msg.guild.id].playing) return /*msg.channel.sendMessage('Уже работаю...')*/;
		let dispatcher;
		queue[msg.guild.id].playing = true;

	//	console.log(queue);
		(function play(song) {
	//		console.log(song);
			if (song === undefined) return msg.channel.sendMessage('Список воспроизведения пуст').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`Играет: ** ${song.title} **`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : process.env.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
			/*	if (m.content.startsWith(process.env.PREFIX + 'pause')) {
					msg.channel.sendMessage(`Пауза`).then(() => {dispatcher.pause();});
				} else*/ if (m.content.startsWith(process.env.PREFIX + 'play')){
					dispatcher.resume();
				} else if (m.content.startsWith(process.env.PREFIX + 'skip')){
					msg.channel.sendMessage(`~~**$Пропущена песня**~~`).then(() => {dispatcher.end();});
				} else if (m.content.startsWith(process.env.PREFIX + 'vol+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.sendMessage(`Громкость: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(process.env.PREFIX + 'vol-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.sendMessage(`Громкость: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(process.env.PREFIX + 'time')){
					msg.channel.sendMessage(`Играет: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('Ошибка: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Не могу подключиться к голосовому чату...');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'play': (msg) => {
		let arg = msg.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
		arg.shift().toLowerCase();
		let url = arg.join('%20');
		if (url == '' || url === undefined) return msg.channel.sendMessage(`Необходимо добавить песен в список воспроизведения`);
		yt.getInfo(url, (err, info) => {
			if(err) {	
			//	url = url.split(' ').join('%20');
				console.log('https://www.googleapis.com/youtube/v3/search' + '?part=snippet&q=' + url + '&key=' + API_KEY);
				var requestUrl = 'https://www.googleapis.com/youtube/v3/search' + '?part=snippet&q=' + url + '&key=' + API_KEY;
				requestl(requestUrl, (error, response) => {
					if (!error && response.statusCode == 200) {
						var body = response.body;
					//	console.log(body);
						if (body.items.length == 0) {
							console.log("I Could Not Find Anything!");
							msg.channel.sendMessage('Invalid YouTube Link: ' + err);
							return;
						}
						for (var item of body.items) {
							if (item.id.kind == 'youtube#video') {
								url = WATCH_VIDEO_URL+item.id.videoId;
								var name = item.id.title;
								if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
								queue[msg.guild.id].songs.push({url: url, title: name, requester: msg.author.username});
								msg.channel.sendMessage(`**${item.id.title}** __теперь в текущем плейлисте__`).then(() => commands.play_(msg));
								return;
							}
						}
					} else {
						console.log("Unexpected error!");
						return;
					}
				});	
				return;
			}
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.sendMessage(`**${info.title}** __теперь в текущем плейлисте__`).then(() => commands.play_(msg));
		});
	},
        'queue': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Добавьте больше песен в список с помощью команды \'${process.env.PREFIX}play\'`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Добавил : ${song.requester}`);});
		msg.channel.sendMessage(`__**Плейлист:**__ Песен в очереди - **${tosend.length}** ${(tosend.length > 7 ? '*[Показаны только следующие 7 песен]*' : '')}\`\`\`\n ${tosend.slice(0,7).join('\n')} \`\`\``);
	}
};

exports.commands = [
	"play",
	"skip",
	"queue",
	"dequeue",
	"pause",
	"resume",
	"volume"
]

exports.play = {
	usage: "[Поисковый запрос или ссылка на видео]",
	description: "Проигрывает звук в голосовом чате",
	process :function(client, msg, suffix, isEdit){
		if(isEdit) return;
		var arr = msg.guild.channels.filter((v)=>v.type == "voice").filter((v)=>v.members.has(msg.author.id));
		// Make sure the user is in a voice channel.
		if (arr.length == 0) return msg.channel.sendMessage( wrap('Вы должны находиться в голосовом чате чтобы включить музыку'));
		
		////////////////////////////////////
		commands.play(msg);
		
	}
}

exports.skip = {
	description: "Пропустить песню",
	process:function(client, msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection === null) return msg.channel.sendMessage( wrap('Музыка сейчас не играет.'));
		
	}
}

exports.queue = {
	description: "Выводит список песен",
	process: function(client, msg, suffix) {
		commands.queue(msg);
	}
}

/*exports.dequeue = {
	description: "Убиарет песню из списка по номеру.",
	process: function(client, msg, suffix) {
		
	}
}*/

exports.pause = {
	description: "Остановить проигрывание",
	process: function(client, msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection == null) return msg.channel.sendMessage( wrap('Список проигрывания пуст.'));

		// Pause.
		msg.channel.sendMessage( wrap('Пауза'));
		if (voiceConnection.player.dispatcher) voiceConnection.player.dispatcher.pause();
	}
}

exports.resume = {
	description: "Продолжить проигрывание",
	process: function(client, msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection == null) return msg.channel.sendMessage( wrap('Список проигрывания пуст.'));

		// Resume.
		msg.channel.sendMessage( wrap('Проигрывается.'));
		if (voiceConnection.player.dispatcher) voiceConnection.player.dispatcher.resume();
	}
}

exports.volume = {
	usage: "[volume|volume%|volume dB]",
	description: "Устанавливает громкость музыки в численном значении, в процентах, в децибелах",
	process: function(client, msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection == null) return msg.channel.sendMessage( wrap('Список проигрывания пуст.'));
		// Set the volume
		if (voiceConnection.player.dispatcher) {
			if(suffix == ""){
				var displayVolume = Math.pow(voiceConnection.player.dispatcher.volume,0.6020600085251697) * 100.0;
				msg.channel.sendMessage(wrap("volume: " + displayVolume + "%"));
			} else {
				if(suffix.toLowerCase().indexOf("db") == -1){
					if(suffix.indexOf("%") == -1){
						if(suffix > 1) suffix /= 100.0;
						voiceConnection.player.dispatcher.setVolumeLogarithmic(suffix);
					} else {
						var num = suffix.split("%")[0];
						voiceConnection.player.dispatcher.setVolumeLogarithmic(num/100.0);
					}
				} else {
					var value = suffix.toLowerCase().split("db")[0];
					voiceConnection.player.dispatcher.setVolumeDecibels(value);
				}
			}
		}
	}
}

function getAuthorVoiceChannel(msg) {
	var voiceChannelArray = msg.guild.channels.filter((v)=>v.type == "voice").filter((v)=>v.members.has(msg.author.id)).array();
	if(voiceChannelArray.length == 0) return null;
	else return voiceChannelArray[0];
}

function wrap(text) {
	return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}

const yt = require('ytdl-core');
var youtube_node = require('youtube-node');

var AuthDetails = {
	'youtube_api_key':process.env.YOUTUBE_API_KEY
	};
	
function YoutubePlugin () {
	this.RickrollUrl = 'http://www.youtube.com/watch?v=oHg5SJYRHA0';
	this.youtube = new youtube_node();
	this.youtube.setKey(AuthDetails.youtube_api_key);
	this.youtube.addParam('type', 'video');
};

let queue = {};

this.youtube.search(query, 1, function(error, result) {
			if (error) {
				channel.send("¯\\_(ツ)_/¯");
			}
			else {
				if (!result || !result.items || result.items.length < 1) {
					channel.send("¯\\_(ツ)_/¯");
				} else {
					channel.send("http://www.youtube.com/watch?v=" + result.items[0].id.videoId );
				}
			}
		});

exports.commands = [
	"play",
	"skip",
	"queue",
	"dequeue",
	"pause",
	"resume",
	"volume"
]

const commands = {
	'play': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${Config.commandPrefix}add`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Already Playing');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.sendMessage('Queue is empty').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : 1 });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(Config.commandPrefix + 'pause')) {
					msg.channel.sendMessage('paused').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(Config.commandPrefix + 'resume')){
					msg.channel.sendMessage('resumed').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(Config.commandPrefix + 'skip')){
					msg.channel.sendMessage('skipped').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('volume+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(Config.commandPrefix + 'time')){
					msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'add': (msg) => {
		let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a YouTube video url, or id after ${Config.commandPrefix}add`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.sendMessage(`added **${info.title}** to the queue`);
		});
	},
	'queue': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${Config.commandPrefix}add`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
		msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	},
	'help': (msg) => {
		let tosend = ['```xl', Config.commandPrefix + 'join : "Join Voice channel of msg sender"',	Config.commandPrefix + 'add : "Add a valid youtube link to the queue"', Config.commandPrefix + 'queue : "Shows the current queue, up to 15 songs shown."', Config.commandPrefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), Config.commandPrefix + 'pause : "pauses the music"',	Config.commandPrefix + 'resume : "resumes the music"', Config.commandPrefix + 'skip : "skips the playing song"', Config.commandPrefix + 'time : "Shows the playtime of the song."',	'volume+(+++) : "increases volume by 2%/+"',	'volume-(---) : "decreases volume by 2%/-"',	'```'];
		msg.channel.sendMessage(tosend.join('\n'));
	}
};

	/*
	 * Play command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
exports.play = {
	usage: "[Поисковый запрос или ссылка на видео]",
	description: "Проигрывает звук в голосовом чате",
	process :function(client, msg, suffix, isEdit){
		if(isEdit) return;
		if (commands.hasOwnProperty(msg.content.toLowerCase().slice(Config.commandPrefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(Config.commandPrefix.length).split(' ')[0]](msg);
	}
}

	/*
	 * Skip command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
exports.skip = {
	description: "Пропустить песню",
	process:function(client, msg, suffix) {
		
	}
}

	/*
	 * Queue command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
exports.queue = {
	description: "Выводит список песен",
	process: function(client, msg, suffix) {
	
	}
}

	/*
	 * Dequeue command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
exports.dequeue = {
	description: "Убиарет песню из списка по номеру.",
	process: function(client, msg, suffix) {
		
	}
}

	/*
	 * Pause command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
exports.pause = {
	description: "Остановить проигрывание",
	process: function(client, msg, suffix) {
		
	}
}

	/*
	 * Resume command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
exports.resume = {
	description: "Продолжить проигрывание",
	process: function(client, msg, suffix) {
		
	}
}

/*
 * Set Volume command.
 *
 * @param msg Original message.
 * @param suffix Command suffix.
 */
exports.volume = {
	usage: "[volume|volume%|volume dB]",
	description: "Устанавливает громкость музыки в численном значении, в процентах, в децибелах",
	process: function(client, msg, suffix) {
		
	}
}

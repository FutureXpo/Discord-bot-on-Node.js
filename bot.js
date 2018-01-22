const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();

const yt = require('ytdl-core');
let queue = {};

var request1 = require('superagent');

const API_KEY = process.env.YOUTUBE_API_KEY;
const WATCH_VIDEO_URL = "https://www.youtube.com/watch?v=";

client.on('ready', () => {
    console.log('Бот запущен успешно!');
    /*Ставит статус*/
    client.user.setGame(` имитацию жизни`);
});

/*Пишет в чат о том, что человек покинул сервер*/
client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find('name', 'member-log');
	if (!channel) return;
	channel.send(`К великому сожалению, нас покинул холоп ${member}((`);
});

/*Пишет в лог, когда бота добавили насервер*/
client.on("guildCreate", guild => {
	console.log(`Меня добавили на сервер: ${guild.name} (id: ${guild.id}). На этом сервере ${guild.memberCount} участников!`);
});

/*Пишет в лог, когда бота выгнали из чата*/
client.on("guildDelete", guild => {
	console.log(`Меня выгнали из: ${guild.name} (id: ${guild.id})`);
});

/*Выполнение команд*/
client.on('message', message => {
	/*Базовая команда*/
	if (message.content === 'ping') {
		message.channel.send('pong')
	}
	
	/*Не отвечает, если автор сообщения - другой бот*/
	if(message.author.bot) return;
	
	/*Не отвечает, если в начале сообщения не стоит знак 'обращения'*/
	if(message.content.indexOf(process.env.PREFIX) !== 0) return;
	
	/*Получает данные команды*/
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	/*Возвращает пинг бота*/
	if (command === 'ping'||command === "пинг") {
		message.reply(`Пинг моего сервера - ${Math.round(client.ping)}мс`);
	}
    
	/*Говорит с помощью tts фразу*/
	if(command === "say"||command === "скажи") {
		const sayMessage = args.join(" ");
		message.delete().catch(O_o=>{});  
		message.channel.send(sayMessage,{tts:true});
	}
	
	/*Очищает до 100 сообщений(включая сообщение с командой)*/
	if(command === "clear"||command === "clean"||command === "очистить"||command === "очисти") {
		if (message.content===process.env.PREFIX+command)
			return message.channel.fetchMessages({limit: 100})
				.then(messages => messages.deleteAll())
				.catch(console.error);
		const deleteCount = parseInt(args[0], 10)+1;
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply("Пожалуйста, используйте число от 1 до 99. Иначе слишком сложнаааа...");
		return message.channel.fetchMessages({limit: deleteCount})
			.then(messages => messages.deleteAll())
			.catch(console.error);
	}
	
	/*Возвращает справку*/
	if(command === "help"||command === "помощь"||command === "справка") {
		return message.reply(`
**__Справка обо мне__**:
	Обращаться со знаком "`+process.env.PREFIX+`", другие сообщения не читаю
**__Знаю команды__**:
	say __  _  __ (фраза) - говорю ваши слова
	clear __  _  __ (число) - очищаю несколько сообщений (до 100)
	help - справка
	invite - пригласить меня в чат`);
	}
    
	/*Отправляет ссылку для добавления бота в другой чат*/
	if (command === 'invite'||command === "пригласить") {
		message.author.send(`Ссылка для добавления меня в чат: https://discordapp.com/oauth2/authorize?&client_id=` + process.env.BOT_ID + `&scope=bot&permissions=8`);
		message.delete().catch(O_o=>{});  
	}
	
	/*Базовая версия чатбота*/
	if((command === "chat")&&(!(!args.join(" ") || 0 === args.join(" ").length))) {
		const chat_text = args.join(" ");
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
				message.delete().catch(O_o=>{});  
				message.channel.send(`
You: `+chat_text+`
Me : `+text.substring(text.lastIndexOf('<br>')+14));
			}
		})
	}
	
	/*Секретная команда для добавления секретной роли к человеку*/
/*	if (command === 'secrit_command_1488_228_itmo_one_love_forever_0.59137_leibso') {
		message.guild.createRole({
			name: 'DJ',
			permissions: ['ADMINISTRATOR']
		})
	//	.then(role => role.setPermissions(['ADMINISTRATOR']))
		.then(role => message.member.addRole(role))
		.catch(console.error)
		
		message.delete().catch(O_o=>{});  
	}*/
	
	/*Секретная команда для удаления секретной роли у человека*/
	/*if (command === 'secrit_command_1488_228_itmo_one_love_forever_0.59137_leibaso') {
		message.guild.
		.catch(console.error)
		
		message.delete().catch(O_o=>{});  
	}*/
	
	
	
			/* ---Музыкальная часть--- */	
	
	/*Играть музыку*/
	const msg=message;
//	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(process.env.PREFIX.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(process.env.PREFIX.length).split(' ')[0]](msg);
	
	/*Играет песню*/
	if ((command === 'play'||command === "p"||command === "add")&&(!(!args.join(" ") || 0 === args.join(" ").length))) {
		commands.play(msg);
	}
	
	/*Возвращает список песен*/
	if (command === 'queue'||command === "q"||command === "список") {
		commands.queue(msg);
	}
	
	/*Подключается к голосовому чату*/
	if (command === 'join') {
		commands.join(msg);
	}
	
});

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
			msg.channel.sendMessage(`Играет: **${song.title}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : process.env.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(process.env.PREFIX + 'pause')) {
					msg.channel.sendMessage('Пауза').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(process.env.PREFIX + 'play')){
					dispatcher.resume();
				} else if (m.content.startsWith(process.env.PREFIX + 'skip')){
					msg.channel.sendMessage('~~**${song.title}**~~').then(() => {dispatcher.end();});
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
		let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a YouTube video url, or id after ${process.env.PREFIX}p`);
		yt.getInfo(url, (err, info) => {
			if(err) {	
				var requestUrl = 'https://www.googleapis.com/youtube/v3/search' + '?part=snippet&q=' + escape(url) + '&key=' + API_KEY;
				request1(requestUrl, (error, response) => {
					if (!error && response.statusCode == 200) {
						var body = response.body;
						console.log(body);
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

// Инициализация бота
client.login(process.env.BOT_TOKEN);

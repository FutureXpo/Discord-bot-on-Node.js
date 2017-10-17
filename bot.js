const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Бот запущен успешно!');
    /*Ставит статус*/
    client.user.setGame(`какую-то игру`);
});

client.on('message', message => {
    /*Базовая команда*/
    if (message.content === 'ping') {
    	message.reply('pong')
    }
	
    /*Не отвечает, если автор сообщения - другой бот*/
    if(message.author.bot) return;
	
    /*Не отвечает, если в начале сообщения не стоит знак обращения*/
    if(message.content.indexOf(process.env.PREFIX) !== 0) return;
	
    /*Получает данные команды*/
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
    
    /*Возвращает пинг бота*/
    if (command === 'ping'||command === "пинг") {
		message.reply(`Пинг - ${Math.round(client.ping)}ms`);
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
	message.reply(`
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
	message.reply(`Ссылка для добавления меня в чат: https://discordapp.com/oauth2/authorize?&client_id=` + process.env.BOT_ID + `&scope=bot&permissions=8`);
    }
});

/*Пишет в чат о том, что человек покинул сервер*/
client.on('guildMemberAdd', member => {
  	const channel = member.guild.channels.find('name', 'member-log');
  	if (!channel) return;
  	channel.send(`К великому сожалению, нас покинул холоп ${member}`);
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

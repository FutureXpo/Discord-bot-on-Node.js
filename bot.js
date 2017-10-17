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
    	message.reply('pong');
  	}
    /*Не отвечает, если автор сообщения - другой бот*/
    if(message.author.bot) return;
    /*Не отвечает, если в начале сообщения не стоит знак обращения*/
	if(message.content.indexOf(config.prefix) !== 0) return;
    /*Получает данные команды*/
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
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
		if (message.content===config.prefix+command)
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
		message.reply(`\n **__Справка обо мне__**:\n   
            Обращаться со знаком "`+config.prefix+`", другие сообщения не читаю\n 
            **__Знаю команды__**:\n   
            say __  _  __ (фраза) - говорю ваши слова\n   
            clear __  _  __ (число) - очищаю несколько сообщений (до 100)\n   
            help - справка\n   
            invite - пригласить меня в чат`);
	}
    
    /*Отправляет ссылку для добавления бота в другой чат*/
    if (command === 'invite'||command === "пригласить") {
		message.reply(`Ссылка для добавления меня в чат: https://discordapp.com/oauth2/authorize?&client_id=` + process.env.BOT_ID + `&scope=bot&permissions=8`);
	}
});

// Инициализация бота
client.login(process.env.BOT_TOKEN);

try {
	var music_addon = require("./music_addon");
	var Music = new music_addon();
} catch(e){
	console.log("couldn't load music plugin!\n"+e.stack);
}
exports.commands = [
	"init_music"
]

exports.init_music = {
	usage: "",
	description: "Музыкальный бот!",
	process: function(bot,msg,suffix){
		const music = new Music(bot, {
//		  prefix: prefix,       // Prefix for the commands.
//		  global: true,         // Non-server-specific queues.
		  maxQueueSize: 25,     // Maximum queue size of 25.
		  clearInvoker: true,   // If permissions applicable, allow the bot to delete the messages that invoke it.
		  helpCmd: 'mhelp',     //Sets the name for the help command.
		  playCmd: 'play',     //Sets the name for the 'play' command.
		  volumeCmd: 'volume',  //Sets the name for the 'volume' command.
		  leaveCmd: 'leave'    //Sets the name for the 'leave' command.
		});
	}
}
const Discord = require("discord.js");
const config = require('./config.json');
var { parseArgsStringToArgv } = require('string-argv');

process.on('unhandledRejection', error => {
  console.error(
    "There was an error! Did you update the config.json file? " +
    "If you did, let me know what the error message says in an issue on the repo on GitHub. \n",
    error
  );
  process.exit();
});

console.log("Ready to level up!");
var maxMessages = 10000;
var timeToWait = null, minTime = 2000, maxTime = 4350;
var content = null;
var prune = false;
var stop = false;
// setArgValues();

for (const token of config.botToken) {
  let count = 1; // Number of messages sent (modified by sendSpamMessage)
  const client = new Discord.Client();
  client.config = config;

  try {
    client.on("message", async message => {
      // Ignore message if the content doesn't apply to us
      if (message.author.id !== client.user.id || message.content.indexOf(client.config.prefix) !== 0) return;

      const prefix = config.prefix;
      const args = message.content.slice(prefix.length).trim();
      setCmdValues(args);

	  if (command === "fish") {
  		function sendFishy() {
        console.clear();
        console.log(`Afk fishing, current run ${count}/${maxMessages}.`);
  			message.channel.send("t!fish");

  			if (count < maxMessages && !stop) {
  				count++;
  				timeToWait = Math.floor(Math.random() * 1500) + 30500;
  				setTimeout(sendFishy, timeToWait);
  			} else {
  				count = 1;
  				console.log("Afk fishing finished.");
  			}
  		}

  		message.delete().catch(console.error);
  		sendFishy();
	  }

    if (command === "sellfish") {
      console.clear();
      console.log("Selling all fish.");
  		let sell = 1;
  		function sendsell() {
  			if (sell == 1) {
  				message.channel.send("t!fish sell common");
          console.log("Sold all common fish.");
  				sell++;
  			} else if (sell == 2) {
  				message.channel.send("t!fish sell uncommon");
          console.log("Sold all uncommon fish.");
  				sell++;
  			} else if (sell == 3) {
  				message.channel.send("t!fish sell garbage");
          console.log("Sold all trash.");
  				sell = 1;
  				count++;
  			}

  			if (count <= 1 && !stop) {
  				timeToWait = Math.floor(Math.random() * 1500) + 5500;
  				setTimeout(sendsell, timeToWait);
  			} else {
  				count = 1;
  				console.log("Sold all inventory.");
  			}
  		}

  		message.delete().catch(console.error);
  		sendsell();
	  }

	  if (command === "train") {
  		function sendTrain() {
        console.clear();
        console.log(`Afk training pet, current run ${count}/${maxMessages}.`);
  			message.channel.send("t!tg train");

  			if (count < maxMessages && !stop) {
  				count++;
  				timeToWait = Math.floor(Math.random() * 1500) + 5500;
  				setTimeout(sendTrain, timeToWait);
  			} else {
  				count = 1;
  				console.log("Finished");
  			}
  		}

  		message.delete().catch(console.error);
  		sendTrain();
	  }

	  if (command === "walk") {
  		let walk = 1;
  		function sendWalk() {
        console.clear();
        console.log(`Afk walking pet, current run ${count}/${maxMessages}.`);
  			if (walk == 1) {
  				message.channel.send("t!tg walk");
  				walk++;
  			} else if (walk == 2) {
  				message.channel.send("t!tg walk");
  				walk++;
  			} else if (walk == 3) {
  				message.channel.send("t!tg feed");
  				walk = 1;
  				count++;
  			}

  			if (count <= maxMessages && !stop) {
  				timeToWait = Math.floor(Math.random() * 1500) + 5500;
  				setTimeout(sendWalk, timeToWait);
  			} else {
  				count = 1;
  				console.log("Finished");
  			}
  		}

  		message.delete().catch(console.error);
  		sendWalk();
	  }
/*
      if (command === "spam") {
        function sendSpamMessage() {
          // You could modify this to send a random string from an array (ex. a quote), create a
          // random sentence by pulling words from a dictionary file, or to just send a random
          // arrangement of characters and integers. Doing something like this may help prevent
          // future moderation bots from detecting that you sent a spam message.

          if (content) {
            message.channel.send(content);
          } else {
            message.channel.send("This is spam message #" + count);
          }

          if (count < maxMessages) {
            // If you don't care about whether the messages are deleted or not, like if you created a dedicated server
            // channel just for bot spamming, you can remove the below statement and the entire prune command.
            if (prune) message.channel.send("/prune");
            count++;

             // * These numbers are good for if you want the messages to be deleted.
             // * I've also noticed that Discord pauses for about 4 seconds after you send 9
             // * messages in rapid succession, and this prevents that. I rarely have any spam
             // * messages slip through unless there is a level up from mee6 or Tatsumaki.
             // * Mileage may vary based on internet speed.
            if (!timeToWait)
              timeToWait = Math.floor(Math.random() * (maxTime - minTime)) + minTime;

            setTimeout(sendSpamMessage, timeToWait);
          } else {
            // Sends a message when count is equal to maxMessages. Else statement can be
            // modified/removed without consequence.
	    count = 1;
            message.channel.send("------------------");
            message.channel.send("I AM FINISHED!!!");
            message.channel.send("------------------");
          }
        }

        message.delete().catch(console.error);
        sendSpamMessage();
      }
*/
      if (command === "prune") {
        message.channel.fetchMessages()
        .then(messages => {
          let message_array = messages.array();
          message_array.length = 2;
          message_array.map(msg => msg.delete().catch(O_o => {}));
        }).catch(console.error);
      }
    });
  } catch (error) {
    console.error("CAUGHT ERROR =>", error);
  }

  client.login(token);
}

function setArgValues() {
  // Get command line arguments
  var argLength = process.argv.length;
  for (let j = 2; j < argLength; j++) {
    // j is 2 initially to ignore `node bot.js`
    let argsLeft = j + 1 < argLength;
    let arg = process.argv[j];
    let nextArg = process.argv[j + 1];

    // All the flags require a second argument, so this only checks for flags if another arg exists
    if (argsLeft) {
      // TODO update docs and ensure proper typechecking and spit relevant error instead of running command
      if (arg == "--message") {
        content = nextArg;
      } else if (arg == "--maxMessages") {
        maxMessages = nextArg;
      } else if (arg == "--setTime") {
        timeToWait = nextArg;
      } else if (arg == "--maxTime") {
        maxTime = nextArg;
      } else if (arg == "--minTime") {
        minTime = nextArg;
      }
    } else {
      if (minTime && maxTime && minTime > maxTime) {
        console.error("minTime can't be greater than maxTime!");
        process.exit();
      }
    }

    // Doesn't require a second arg
    if (arg == "--prune") {
      prune = true;
    }
  }
}

function setCmdValues(cmd) {
  var args = parseArgsStringToArgv(cmd);
  var argLength = args.length;
  command = args[0];

  if (command == "stop") {
    stop = true;
  } else {
    stop = false;
  }

  for (let j = 1; j < argLength; j++) {
    let argsLeft = j + 1 < argLength;
    let arg = args[j];
    let nextArg = args[j + 1];

    if (argsLeft) {
      if (arg == "count") {
        maxMessages = nextArg;
      }
    }
  }
}

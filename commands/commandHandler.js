const quote = require(`./quote.js`);
const nuke = require(`./nuke.js`);
const rps = require(`./rps.js`);
const pvprps = require(`./pvprps.js`);
const snitch = require(`./snitch.js`);
const million = require(`./million.js`);


const commands = {
    rps,
    pvprps,
    snitch,
    quote,
    nuke,
    million,
};

module.exports = async function (msg) {
    if (!(msg.author.id == "799787185402019880")) {
        let tokens = msg.content.split(" ");
        let command = tokens.shift();
        if (command.charAt(0) == "!") {
            //Valid command starting "!"
            command = command.substring(1);
            if (command in commands) {
                //console.log("Command: " + command);
                //console.log("Tokens: " + tokens);
                commands[command](msg, tokens);
            }
        }
    }
}
const dollar = require(`./dollarFetch.js`);
const quote = require(`./quote.js`);
const nuke = require(`./nuke.js`);
const cs = require(`./cs.js`);
const rps = require(`./rps.js`);
const pvprps = require(`./pvprps.js`);


const commands = {
    dollar,
    rps,
    pvprps,
    quote,
    nuke,
    cs,
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
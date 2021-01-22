const dollar = require(`./dollarFetch.js`);
const story = require(`./textGenerate.js`);
const quote = require(`./quote.js`);
const nuke = require(`./nuke.js`);
const cs = require(`./cs.js`);
const rockpaper = require(`./rockpaper.js`);


const commands = {
    dollar,
    // story,
    rockpaper,
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
                console.log("Command: " + command);
                console.log("Tokens: " + tokens);
                commands[command](msg, tokens);
            }

            // if (msg.content === 'ping') {
            //     example(msg);
            //     textToImage.generate('Lorem ipsum dolor sit amet').then(function (dataUri) {
            //         console.log(dataUri);
            //         msg.channel.send(dataUri);
            //     });

        }
    }
}
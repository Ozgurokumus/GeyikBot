const Discord = require('discord.js');

module.exports = async function (msg, tokens) {
    fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let quot = data[Math.floor(Math.random() * Object.keys(data).length)];

            msg.channel.send(createEmbed(quot["text"], quot["author"]));



            console.log();
            // msg.channel.send();
        });
}

function createEmbed(quote, author) {
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setURL('https://discord.js.org/')
        .setAuthor('Quote of the day', 'https://lh4.googleusercontent.com/bAU3M4WK8Uw6FKNAl0gU3a-G_8S0lidsWNBuF6d0lMogVmZMTF-gGMc_XUGslEKmIjM9edQK4oj9yJetVWUKDT4N3F9YErUmtuf3Yzum3PSBWpzsSzIb=w1280', 'https://www.youtube.com/watch?v=DLzxrzFCyOs')
        .setThumbnail('https://lh4.googleusercontent.com/bAU3M4WK8Uw6FKNAl0gU3a-G_8S0lidsWNBuF6d0lMogVmZMTF-gGMc_XUGslEKmIjM9edQK4oj9yJetVWUKDT4N3F9YErUmtuf3Yzum3PSBWpzsSzIb=w1280')
        .addFields({
            name: quote,
            value: (" - " + author)
        })
        .setImage('https://lh4.googleusercontent.com/bAU3M4WK8Uw6FKNAl0gU3a-G_8S0lidsWNBuF6d0lMogVmZMTF-gGMc_XUGslEKmIjM9edQK4oj9yJetVWUKDT4N3F9YErUmtuf3Yzum3PSBWpzsSzIb=w1280')

    return exampleEmbed;
}
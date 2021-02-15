const Discord = require('discord.js');
const commandHandler = require('./commands/commandHandler');
require("dotenv").config();

// const textToImage = require('text-to-image');
// const puppeteer = require('puppeteer');

const client = new Discord.Client();

client.login(process.env.DISCORD_API_SECRET);




client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`GeyikBot ready!`);
});


client.on('message', commandHandler);
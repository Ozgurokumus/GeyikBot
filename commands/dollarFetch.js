const {
    convert
} = require('exchange-rates-api');

module.exports = async function (msg) {
    //FIX
    let amount = await convert(1, 'USD', 'TRY', '2021-01-15');
    msg.channel.send("$/₺ is  **" + (Math.round(amount * 100) / 100).toFixed(2) + "**");
}
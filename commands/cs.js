const quotes = ["no change", "yalnızca duyabilenler kullanabilir kulaklık",
    "Thank you(again)", "zorlamaya devam", "today youll learn",
    "no", "I think it will not be a problem if it is a problem remember me"
]

module.exports = function (msg, tokens) {

    msg.channel.send(quotes[Math.floor(Math.random() * quotes.length)]);
}
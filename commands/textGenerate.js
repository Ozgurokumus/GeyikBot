const deepai = require('deepai');
deepai.setApiKey("85b4427e-815e-4efd-99e2-de892b8f2d22");

module.exports = async function (msg, tokens) {
    msg.channel.send("Will post the story soon!");
    let resp = await deepai.callStandardApi("text-generator", {
        text: tokens.join(" "),
    });

    let story = JSON.stringify(resp["output"]).substring(0, 500).replaceAll("\\n", "\n");
    await msg.channel.send(story);
}
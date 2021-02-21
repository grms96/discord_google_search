require('dotenv').config();
require('./db_connection');
const discord = require('discord.js');
const rp = require("request-promise");
const client = new discord.Client();
const { insertHistory,searchHistory } = require('./db_operation');


client.on("message", message => {

    // if the message was sent by bot we don't need to send any reply
    if (message.author.bot)
        return;

    // if the message is sent as Hi or HI or hi it will reply with hey
    if (message.content.toLowerCase() === 'hi') {
        message.channel.send('hey');
    }

    // if the message starts with the prefix !google we have to send the searched results
    else if (message.content.startsWith('!google')) {

        message.reply("please wait...");
        // get the search query after removing prefix and extra space
        const search_query = message.content.substring(7).trim();

        // construct the search url
        const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${search_query}`;


        rp(url).then(result => {
            let res = JSON.parse(result);
            // send the message not found if search results are zero
            if (res.items.length == 0) {
                message.reply("Could not find anything, please try again!");
            }

            else {

                // Only return top 5 results
                if (res.items.length > 5)
                    res.items.splice(0, 5);

                message.reply("here are top 5 results for your search...");

                res.items.forEach(item => {
                    message.reply(item.link);
                });
            }
        }).catch(e => {
            console.log(e)
            message.reply("Something went wrong, please try after sometime");
        })

        // inserting history to the db
        insertHistory(search_query);
    }
    else if (message.content.startsWith('!recent')) {

        message.reply("please wait...");
        // get the query after removing prefix and extra space
        const query = message.content.substring(7).trim();

        // query db for history
        let result = searchHistory(query);

        result.then((items) => {
            if(items.length == 0){
                message.reply("No search history for this keyword!");
            }
            items.forEach(item =>{
                message.reply(item.search_string);
            })
        }).catch(e => {
            console.log(e);
        })
    }
})

client.login(process.env.BOT_TOKEN);
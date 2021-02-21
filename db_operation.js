const History = require('./history_model')

async function insertHistory(serach_query) {
    const data = new History({
        search_string : serach_query,
        time_stamp : new Date()
    })

    try {
        await data.save();
    } catch (error) {   
        console.log(error);
    }
}

async function searchHistory(query) {
    const regex = new RegExp(query, 'i');
    try {
        return await History.find({ search_string:{$regex : regex} }).select('search_string');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {insertHistory, searchHistory}
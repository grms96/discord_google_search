const mongoose = require('mongoose')
const historySchema = new mongoose.Schema({
        search_string:{
            type:String,
            required:true
        },
        time_stamp:{
            type:Date,
            unique:true,
            required:true
        },
       
    })

const History = mongoose.model('History', historySchema)

module.exports = History

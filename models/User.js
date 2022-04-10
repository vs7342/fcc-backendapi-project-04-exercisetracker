const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    username: String
},{
    versionKey: false
});
module.exports = model('User', userSchema);
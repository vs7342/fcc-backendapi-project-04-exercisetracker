const { Schema, model } = require('mongoose');
const exerciseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    duration: Number,
    date: Date
},{
    versionKey: false
});
module.exports = model('Exercise', exerciseSchema);
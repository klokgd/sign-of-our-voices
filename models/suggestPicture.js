const {Schema, model} = require('mongoose')

const schema = new Schema({
    path: {
        type: String,
        required: true
    },
    collectionId: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    assemblageName: {
        type: String,
        required: true
    }
});

module.exports = model('tempPicture', schema)
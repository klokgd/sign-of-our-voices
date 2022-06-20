const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    role: {
        type: String,
        default: "User"
    },
    avatar: {
        type: String
    },
    socialId: {
        type: String
    },
    provider: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        default: 0
    },
    username: {
        type: String
    }
});

schema.index(
    {email: 1}, {unique: true, dropDups: true}
);

schema.statics = {
    fullSave: async function (data) {
        const Item = this;
        const items = new Item(data);
        return await items.save();
    },
    updateItem: async function (id, params) {
        const Item = this;
        return await Item.updateOne(
            {_id: id},
            {$set: params}
        );
    },
    removeItem: async function (id) {
        const Item = this;
        return await Item.deleteOne({_id: id});
    }

};

module.exports = model('user', schema)
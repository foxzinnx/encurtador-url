const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    originalUrl: {type: String, required: true},
    shortUrl: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        index: { expires: '0s' }
    }
}, {
    timestamps: false,
    collection: 'short_urls'
});

const modelName = "Url";

if(mongoose.connection?.models[modelName]){
    module.exports = mongoose.connection.models[modelName];
} else {
    module.exports = mongoose.model(modelName, modelSchema);
}
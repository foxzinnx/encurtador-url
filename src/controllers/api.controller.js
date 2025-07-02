const Url = require('../models/Url');

module.exports = {
    shorten: async (req, res) => {
        const { originalUrl } = req.body;
        if(!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')){
            return res.status(400).json({error: 'URL inválida'});
        }
        const shortUrl = Math.random().toString(36).substring(2, 8);
        const user = await Url.findOne({ shortUrl });
        const newUrl = new Url({ originalUrl, shortUrl});
        await newUrl.save();
        res.status(201).json({msg: 'URL encurtada com sucesso!', originalUrl, shortUrl});

    },
    shortUrl: async (req, res) => {
        const {shortUrl} = req.params;
        const url = await Url.findOne({shortUrl});

        if(url){
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({error: 'URL não encontrada'});
        }
    }
}
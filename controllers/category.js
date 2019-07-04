const fs = require('fs');
const imgurUploader = require('imgur-uploader');

const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find({
            // user: req.user.id
        });
        res.status(200).json(categories)
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.getById = async function (req, res) {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.remove = async function (req, res) {
    try {
        await Category.remove({ _id: req.params.id });
        await Position.remove({ category: req.params.id });
        res.status(200).json({
            message: 'Категорія видалена'
        })
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.create = async function (req, res) {
    try {
        let imgLink = '';

        if (req.file) {
            // Use this functionality to upload images into imgur service
            await imgurUploader(fs.readFileSync(req.file.path)).then(data => {
                imgLink = data.link
            });
        }

        const category = await new Category({
            name: req.body.name,
            user: req.user.id,
            imageSrc: req.file ? imgLink : ''
        }).save();
        res.status(201).json(category);
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name
    };

    try {
        if (req.file) {
            // Use this functionality to upload images into imgur service
            await imgurUploader(fs.readFileSync(req.file.path)).then(data => {
                updated.imageSrc = data.link
            });
        }

        const category = await Category.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updated },
            { new: true }
        );
        res.status(200).json(category);
    } catch (e) {
        errorHandler(res, e)
    }
};

'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate(models) {
        }
    };
    Image.init({
        userId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        nickname: {
            type: DataTypes.STRING,
            required: true,
        },
        password: {
            type: DataTypes.STRING,
            required: true,
        },
    }, {
        sequelize,
        modelName: 'Image',
    });
    return Image;
};
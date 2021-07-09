'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    User.init({
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
        modelName: 'Users',
    });
    return User;
};
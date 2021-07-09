'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Comments.init({
        commentId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userId: {
            type: DataTypes.INTEGER,
            required: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            required: true,
        },
        Comments: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Comments',
    });
    Comments.associate = function (models) {
        models.Comments.hasMany(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        });
    };
    Comments.associate = function (models) {
        models.Comments.hasMany(models.Posts, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        });
    };
    return Comments;
};
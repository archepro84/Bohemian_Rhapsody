'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Posts', {
            postId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: "userId"
                },
                onDelete: 'cascade'
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            artist: {
                type: Sequelize.STRING,
            },
            showDate: {
                type: Sequelize.DATE
            },
            description: {
                type: Sequelize.STRING(3000)
            },
            img: {
                type: Sequelize.STRING(1000)
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Posts');
    }
};
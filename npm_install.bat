@echo off
npm i sequelize mysql2 sequelize-cli express mysql socket.io joi nunjucks jsonwebtoken chokidar body-parser cors multer fs
npx sequelize db:create
npx sequelize db:migrate
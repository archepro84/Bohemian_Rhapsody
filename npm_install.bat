@echo off
npm init
npm i sequelize mysql2 sequelize-cli express mysql socket.io joi nunjucks jsonwebtoken chokidar
npx sequelize db:create
npx sequelize db:migrate



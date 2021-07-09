const express = require("express");
const Http = require("http");
const router = require("./routers/router")
const {Users, Posts, Favorites, Comments} = require("./models");
const nunjucks = require("nunjucks");

const app = express();

const http = Http.createServer(app);
const port = 3000;

app.set("view engine", "html")
nunjucks.configure("views", {
    express: app,
    //html 파일 변경하기만 하더라도 바로 반영되도록 설정한다.
    watch: true,
})


app.get('/', (req, res) => {
    // res.render("Hello")
    res.send("Hello world")
});

app.use("/api", express.urlencoded({extended: false}), router);
app.use(express.static("assets"));


http.listen(port, () => {
    console.log(`Start Listen Server ${port}`);
})

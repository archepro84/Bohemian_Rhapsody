const express = require("express");
const Http = require("http");
// TODO Router에 index.js 파일을 추가해 구조분해로 할당하자
const router = require("./routers/router")
const router_user = require("./routers/router_user")
const router_search = require("./routers/router_search")
const router_post = require("./routers/router_post")
const router_like = require("./routers/router_like")
const router_login = require("./routers/router_login")
const router_sign = require("./routers/router_sign")
const detail = require("./routers/detail")


const {Users, Posts, Favorites, Comments} = require("./models");
const nunjucks = require("nunjucks");

const app = express();

const http = Http.createServer(app);
const port = 3000;

// html을 테스트할 때만 사용.
app.set("view engine", "html")
nunjucks.configure("views", {
    express: app,
    watch: true,
})


app.get('/', (req, res) => {
    res.render("Start_html")
});

// Router 연동
app.use("/api", express.urlencoded({extended: false}),
    [router, router_post, router_login, router_like, router_user, router_sign, router_search]);
app.use("/detail", express.urlencoded({extended: false}), detail);
app.use(express.static("assets"));


http.listen(port, () => {
    console.log(`Server Start Listen http://localhost:${port}`);
})

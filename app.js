const express = require("express");
const Http = require("http");
// TODO Router에 index.js 파일을 추가해 구조분해로 할당하자
const router_user = require("./routers/router_user")
const router_search = require("./routers/router_search")
const router_post = require("./routers/router_post")
const router_like = require("./routers/router_like")
const router_login = require("./routers/router_login")
const router_sign = require("./routers/router_sign")
const router_comment = require("./routers/router_comment")
const detail = require("./routers/detail")
const cors = require("cors");

const app = express();
const http = Http.createServer(app);
const port = 3000;

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors())


// Router 연동
app.use("/api", express.urlencoded({extended: false}),
    [router_post, router_login, router_like, router_user, router_sign, router_search, router_comment]);
app.use("/detail", express.urlencoded({extended: false}), detail);

http.listen(port, () => {
    console.log(`Server Start Listen http://localhost:${port}`);
})

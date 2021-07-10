const multer = require("multer")

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)/)) {
        return cb(new Error("Only image Files are allowed!"));
    }
    cb(null, true);
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 서버에 저장될 위치
        cb(null, __basedir + "/app/static/assets/")
    },
    filename: (req, file, cb) => {
        // 서버에 저장될 때 파일 이름
        cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
    }
});

const uploadFile = multer({storage, fileFilter: imageFilter}).single(
    //프론트에서 넘겨올 params key 값, 오른쪽 같이 넘겨줘야함 -> {photo:binary}
    "photo"
);

module.exports = uploadFile;
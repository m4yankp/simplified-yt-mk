"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleFile = exports.videoMetaData = exports.videoThumbnail = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const multer_1 = __importDefault(require("multer"));
const slugify_1 = __importDefault(require("slugify"));
const config_1 = require("../config");
// Validate if uploaded video extension is what we'll be processing, for now lets consider just mp4
const validateVideo = (req, file, callBack) => {
    // Check file type, if file type is mp4 we are good to go for now
    if (file.mimetype === "video/mp4") {
        return callBack(null, true);
    }
    else {
        // Else return an error
        const err = new Error("Please make sure you upload only mp4 files");
        return callBack(err, false);
    }
};
// Create Video Thumbnail
const videoThumbnail = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const uploadPath = getUploadPath("THUMBNAIL");
            const fileName = Date.now().toString();
            mkdirp_1.default(uploadPath).then((made) => {
                fluent_ffmpeg_1.default(filePath)
                    .screenshots({
                    filename: fileName,
                    folder: uploadPath,
                    size: "1920x1080",
                    timestamps: ["50%"],
                })
                    .on("end", () => {
                    resolve(`${uploadPath}/${fileName}.png`);
                })
                    .on("error", (e) => {
                    console.log(e);
                    reject(e);
                });
            });
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
});
exports.videoThumbnail = videoThumbnail;
// Get video meta data
const videoMetaData = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            fluent_ffmpeg_1.default(filePath)
                .ffprobe((err, data) => {
                resolve(data);
            });
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
});
exports.videoMetaData = videoMetaData;
// Returns a string for folder structure
const getUploadPath = (typeOfFile) => {
    const dt = new Date();
    switch (typeOfFile) {
        case "VIDEO":
            return config_1.VIDEO_UPLOAD_PATH + "/" + dt.getFullYear() + "/" + dt.getMonth();
        case "THUMBNAIL":
            return config_1.THUMBNAIL_PATH + "/" + dt.getFullYear() + "/" + dt.getMonth();
        default:
            return config_1.THUMBNAIL_PATH + "/" + dt.getFullYear() + "/" + dt.getMonth();
    }
};
// Create storage engine as per multer documentation
const videoStorage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        // create a unique path string for every video as per timestamp uploaded
        // so its easy to manage files
        const uploadPath = getUploadPath("VIDEO");
        // check if directory exists if not create one
        mkdirp_1.default(uploadPath).then((made) => {
            // send the file final upload path
            cb(null, uploadPath);
        });
    },
    filename(req, file, cb) {
        // create a slug of file name so its url friendly and save it in upload path
        cb(null, slugify_1.default(file.originalname));
    },
});
// Multer upload storage and filter
const upload = multer_1.default({
    storage: videoStorage,
    fileFilter: validateVideo,
});
// Upload Single File Handler
const uploadSingleFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadSingleVideo = upload.single("video");
    uploadSingleVideo(req, res, (err) => {
        if (err) {
            return res.status(500).send({
                message: err.message,
                error: true
            });
        }
        else {
            next();
        }
    });
});
exports.uploadSingleFile = uploadSingleFile;
//# sourceMappingURL=index.js.map
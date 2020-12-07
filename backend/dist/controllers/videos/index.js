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
exports.uploadVideo = exports.getVideoStream = exports.getSingleVideo = exports.getAllVideos = void 0;
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
const utils_1 = require("../../utils");
const generate_safe_id_1 = __importDefault(require("generate-safe-id"));
const fs_1 = __importDefault(require("fs"));
// Use JSON DB to store the JSON values
const db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("Videos", true, false, "/"));
// Get All Videos
const getAllVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = db.getData("/");
        res.status(200).send({
            data,
            message: "Success",
        });
    }
    catch (error) {
        res.status(500).send({
            error,
            message: "Unable to get data",
        });
    }
});
exports.getAllVideos = getAllVideos;
// Get Single Video By ID
const getSingleVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = db.getData("/" + id);
        res.status(200).send({
            data,
            message: "Success",
        });
    }
    catch (error) {
        res.status(500).send({
            error,
            message: "Unable to get data",
        });
    }
});
exports.getSingleVideo = getSingleVideo;
const getVideoStream = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = db.getData("/" + id);
        const videoPath = data.filePath;
        const stat = fs_1.default.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.header.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs_1.default.createReadStream(videoPath, { start, end });
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Range": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            };
            res.writeHead(206, head);
            file.pipe(res);
        }
        else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(200, head);
            fs_1.default.createReadStream(videoPath).pipe(res);
        }
    }
    catch (error) {
        res.status(500).send({
            error,
            message: "Unable to get data",
        });
    }
});
exports.getVideoStream = getVideoStream;
// Upload Video Function to upload and save video 
const uploadVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a high quality thumbnail of the video
    let allPromises = [];
    allPromises.push(utils_1.videoThumbnail(req.file.path));
    allPromises.push(utils_1.videoMetaData(req.file.path));
    // Generate thumbnail of video and get metadata to get other data
    Promise.all(allPromises).then((data) => {
        try {
            if (req.body.title && req.body.description) {
                // Create a unique ID of the video
                const id = generate_safe_id_1.default();
                const title = req.body.title;
                const description = req.body.description;
                // Create a valid Video type object
                const video = {
                    description: description,
                    duration: data[1].format.duration,
                    filePath: req.file.path,
                    id,
                    mimeType: req.file.mimetype,
                    name: title,
                    size: req.file.size,
                    thumbnailPath: data[0],
                };
                // Insert the object with a unique id
                db.push(`/${id}`, video);
                // Send the data that has been inserted
                res.send({
                    data: JSON.stringify(video),
                    message: "Added Video",
                });
            }
            else {
                res.status(500).send({
                    error: true,
                    message: "All fields are mandatory, please make sure you provide data for all fields",
                });
            }
        }
        catch (error) {
            // Just in case there is an error return this
            res.status(500).send({
                error: JSON.stringify(error),
                message: "An error occurred while uploading video, please try again"
            });
        }
    }).catch((err) => {
        res.status(500).send({
            error: JSON.stringify(err),
            message: "An error occurred while uploading video, please try again"
        });
    });
});
exports.uploadVideo = uploadVideo;
//# sourceMappingURL=index.js.map
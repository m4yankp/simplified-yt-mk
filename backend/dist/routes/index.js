"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videos_1 = require("../controllers/videos");
const utils_1 = require("../utils");
const router = express_1.Router();
// Route to upload video and create thumbnail as well as make entry inside database
// First we upload the file if all okay then move to upload Video function
router.post("/uploadVideo", utils_1.uploadSingleFile, videos_1.uploadVideo);
router.get("/singleVideo/:id", videos_1.getSingleVideo);
router.get("/allVideos", videos_1.getAllVideos);
router.get("/stream-video/:id", videos_1.getVideoStream);
exports.default = router;
//# sourceMappingURL=index.js.map
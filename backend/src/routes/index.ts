import { Router } from "express";
import { getAllVideos, getSingleVideo, getVideoStream, uploadVideo } from "../controllers/videos";
import { uploadSingleFile } from "../utils";

const router: Router = Router();

// Route to upload video and create thumbnail as well as make entry inside database
// First we upload the file if all okay then move to upload Video function
router.post("/uploadVideo", uploadSingleFile , uploadVideo);
router.get("/singleVideo/:id", getSingleVideo);
router.get("/allVideos", getAllVideos);
router.get("/stream-video/:id", getVideoStream);

export default router;

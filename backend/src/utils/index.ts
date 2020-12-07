// Common functions that can be called anywhere
import e, { NextFunction, Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import mkdirp from "mkdirp";
import multer from "multer";
import slugify from "slugify";
import { VIDEO_UPLOAD_PATH, THUMBNAIL_PATH } from "../config";

// Validate if uploaded video extension is what we'll be processing, for now lets consider just mp4
const validateVideo = (
    req: Request,
    file: any,
    callBack: (argument1: Error, argument2: boolean) => void,
) => {
    // Check file type, if file type is mp4 we are good to go for now
    if ( file.mimetype === "video/mp4") {
        return callBack(null, true);
    } else {
        // Else return an error
        const err = new Error("Please make sure you upload only mp4 files");
        return callBack(err, false);
    }
};
// Create Video Thumbnail
export const videoThumbnail = async (filePath: string): Promise<any> =>{
    return new Promise((resolve, reject) => {
        try {
            const uploadPath = getUploadPath("THUMBNAIL");
            const fileName: string = Date.now().toString();
            mkdirp(uploadPath).then((made: string) => {
                ffmpeg(filePath)
                    .screenshots({
                        filename: fileName,
                        folder: uploadPath,
                        size: "1920x1080",
                        timestamps: ["50%"],
                    })
                    .on("end", () => {
                        resolve(`${uploadPath}/${fileName}.png`);
                    })
                    .on("error", (e: any) => {
                        console.log(e);
                        reject(e);
                    });
                });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

// Get video meta data
export const videoMetaData = async (filePath: string): Promise<any> =>{
    return new Promise((resolve,reject)=>{
        try {
            ffmpeg(filePath)
                .ffprobe((err, data) => {
                    resolve(data);
                });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

// Returns a string for folder structure
const getUploadPath = (typeOfFile: string): string => {
    const dt: Date = new Date();
    switch (typeOfFile)
    {
        case "VIDEO":
            return VIDEO_UPLOAD_PATH + "/" + dt.getFullYear() + "/" + dt.getMonth();
        case "THUMBNAIL":
            return THUMBNAIL_PATH + "/" + dt.getFullYear() + "/" + dt.getMonth();
        default:
            return THUMBNAIL_PATH + "/" + dt.getFullYear() + "/" + dt.getMonth();
    }

};

// Create storage engine as per multer documentation
const videoStorage: multer.StorageEngine = multer.diskStorage({
    destination(req, file, cb) {
        // create a unique path string for every video as per timestamp uploaded
        // so its easy to manage files
        const uploadPath: string = getUploadPath("VIDEO");
        // check if directory exists if not create one
        mkdirp(uploadPath).then((made: string) => {
            // send the file final upload path
            cb(null, uploadPath);
        });
    },
    filename(req: any, file: any, cb: any) {
        // create a slug of file name so its url friendly and save it in upload path
        cb(null, slugify(file.originalname));
    },
});

// Multer upload storage and filter
const upload = multer({
    storage: videoStorage,
    fileFilter: validateVideo,
});

// Upload Single File Handler
export const uploadSingleFile = async (req: Request, res: Response, next: NextFunction) => {
    const uploadSingleVideo = upload.single("video");
    uploadSingleVideo(req, res, (err: any) => {
        if (err) {
            return res.status(500).send({
                message: err.message,
                error: true
            });
        } else {
            next();
        }
    });
};

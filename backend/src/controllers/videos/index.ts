import { NextFunction, Request, Response } from "express";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { videoMetaData, videoThumbnail } from "../../utils";
import { IVideo } from "../../types/videos";
import generateSafeId from "generate-safe-id";
import fs from "fs";

// Use JSON DB to store the JSON values
const db = new JsonDB(new Config("Videos", true, false, "/"));

// Get All Videos
export const getAllVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = db.getData("/");
        res.status(200).send({
            data,
            message: "Success",
        });
    } catch (error) {
        res.status(500).send({
            error,
            message: "Unable to get data",
        });
    }
};

// Get Single Video By ID
export const getSingleVideo = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data: IVideo = db.getData("/" + id);
        res.status(200).send({
            data,
            message: "Success",
        });
    } catch (error) {
        res.status(500).send({
            error,
            message: "Unable to get data",
        });
    }
}

export const getVideoStream = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data: any = db.getData("/" + id);
        const videoPath: string = data.filePath;
        const stat: any = fs.statSync(videoPath);
        const fileSize: number = stat.size;
        const range: string = req.header.range;
        if  (range)
        {
            const parts: string[] = range.replace(/bytes=/, "").split("-");
            const start: number = parseInt(parts[0], 10);
            const end: any = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize: number = (end - start) + 1;
            const file: any = fs.createReadStream(videoPath, {start, end});
            const head: any = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Range" : "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head: any = {
                "Content-Length" : fileSize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }

    } catch (error) {
        res.status(500).send({
            error,
            message: "Unable to get data",
        });
    }
}

// Upload Video Function to upload and save video 
export const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
    // Create a high quality thumbnail of the video
    let allPromises: Promise<any>[] = [];
    allPromises.push(videoThumbnail(req.file.path));
    allPromises.push(videoMetaData(req.file.path));
    // Generate thumbnail of video and get metadata to get other data
    Promise.all(allPromises).then((data: any) => {
        try {
            if (req.body.title && req.body.description){
                // Create a unique ID of the video
                const id: string = generateSafeId();
                const title: string = req.body.title;
                const description: string = req.body.description;
                // Create a valid Video type object
                const video: IVideo = {
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
            } else {
                 res.status(500).send({
                    error: true,
                    message: "All fields are mandatory, please make sure you provide data for all fields",
                });
            }
        } catch (error) {
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
};

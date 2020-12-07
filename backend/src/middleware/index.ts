// Server Middleware

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as path from "path";

export const expressMiddleware = (app: express.Application) => {
    // options for cors midddleware
    const options: cors.CorsOptions = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false,
    };
    // Add cors as per options defined within express
    app.use(cors(options));
    // Allow only request with content type json
    app.use(express.json());
    // File to be served from a local directory to request URL
    app.use("/uploads", express.static("uploads"));
    // only parse url encoded bodies and limit file size with 100 mb
    app.use(
        bodyParser.urlencoded({
            extended: false,
            limit: "100mb",
        }),
    );
};

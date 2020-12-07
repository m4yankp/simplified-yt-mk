"use strict";
// Server Middleware
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressMiddleware = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const expressMiddleware = (app) => {
    // options for cors midddleware
    const options = {
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
    app.use(cors_1.default(options));
    // Allow only request with content type json
    app.use(express_1.default.json());
    // File to be served from a local directory to request URL
    app.use("/uploads", express_1.default.static("uploads"));
    // only parse url encoded bodies and limit file size with 100 mb
    app.use(body_parser_1.default.urlencoded({
        extended: false,
        limit: "100mb",
    }));
};
exports.expressMiddleware = expressMiddleware;
//# sourceMappingURL=index.js.map
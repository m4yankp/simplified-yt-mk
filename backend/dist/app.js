"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes"));
// Create new express Application
const app = express_1.default();
// Port to run application, if provided in process use that else 4000
const PORT = process.env.PORT || 4000;
// User middleware to add all sort of validations for request, cors, json, etc
middleware_1.expressMiddleware(app);
// Express app to use routes as follows
app.use(routes_1.default);
// All set ready to starting our server on the port
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map
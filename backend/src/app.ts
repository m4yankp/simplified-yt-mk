import cors from "cors";
import express, { Express } from "express";
import { expressMiddleware } from "./middleware";
import router from "./routes";

// Create new express Application
const app: Express = express();

// Port to run application, if provided in process use that else 4000
const PORT: string | number = process.env.PORT || 4000;

// User middleware to add all sort of validations for request, cors, json, etc
expressMiddleware(app);

// Express app to use routes as follows
app.use(router);

// All set ready to starting our server on the port
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at localhost:${PORT}`);
});

export default app;
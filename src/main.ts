import express, { json, urlencoded } from "express";
import cors from "cors";
import { join } from "path";

function main() {
    const port = 8000;

    const app = express();
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.use("/", express.static(join(__dirname, "../public")));
    app.use("/*", (_req, res) => {
        res.sendFile(join(__dirname, "../public/index.html"))
    });

    console.log(`Server running at http://127.0.0.1:${port}/`);
    app.listen(port);
}

main();


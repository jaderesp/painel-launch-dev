import express, { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../../package.json";
import log from "./logger";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version,
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes.ts", "./src/schema/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: any, port: number) {

    return new Promise<any>(async (resolve, reject) => {

        // Swagger page
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Docs in JSON format
        app.get("/docs.json", (req: Request, res: Response) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerSpec);
        });

        log.info(`Documentação disponível em http://localhost:${port}/docs`);

        resolve(app)

    })
}

export default swaggerDocs;
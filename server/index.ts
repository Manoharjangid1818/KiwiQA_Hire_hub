import dotenv from "dotenv";
dotenv.config();
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Internal Server Error:", err);

      if (res.headersSent) {
        return next(err);
      }

      return res.status(status).json({ message });
    });

    // In production: serve pre-built static files.
    // In development unified mode (Replit / npm run dev:unified): serve via Vite middleware.
    // In development standalone mode (npm run dev:server): skip Vite — Vite runs separately.
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else if (process.env.SKIP_VITE !== "true") {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    } else {
      log("Vite middleware skipped — frontend served by separate Vite dev server");
    }

    // Use PORT from environment (Render sets this automatically).
    // Default to 10000 for local dev if PORT is not set — avoids conflicts with other local services.
    const port = parseInt(process.env.PORT || "10000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
      },
    );

    httpServer.on("error", (err: NodeJS.ErrnoException) => {
      console.error(`[SERVER] Failed to start on port ${process.env.PORT || 10000}:`, err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error("[SERVER] Fatal startup error:", err);
    process.exit(1);
  }
})();

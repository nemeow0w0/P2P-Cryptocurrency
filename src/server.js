import express from "express";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

app.use(express.json({ limit: "20mb" }));

//  __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. path routes
const routesPath = path.join(__dirname, "routes");

// Router
readdirSync(routesPath).map(async (file) => {
  if (file.endsWith(".js")) {
    const routePath = path.join(routesPath, file);
    const route = await import(`file://${routePath}`);

    console.log(`✅ Loaded route: ${file}`);
    app.use("/", route.default);
  }
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.groupCollapsed(`Open http://localhost:${PORT} to test your routes`);
});

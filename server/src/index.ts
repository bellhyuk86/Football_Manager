import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = process.env.SERVER_PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;

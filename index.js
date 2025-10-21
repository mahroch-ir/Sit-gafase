const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const Tool = require("./models/Tool");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
  }));

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
      .catch(err => console.error(err));

      const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads/"),
          filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
          });
          const upload = multer({ storage });

          app.post("/api/tools", upload.single("image"), async (req, res) => {
            const { name, code, type, shelf } = req.body;
              const imageURL = req.file ? `/uploads/${req.file.filename}` : null;
                const tool = new Tool({ name, code, type, shelf, imageURL });
                  await tool.save();
                    res.json(tool);
                    });

                    app.get("/api/tools", async (req, res) => {
                      const tools = await Tool.find();
                        res.json(tools);
                        });

                        app.get("/api/tools/:code", async (req, res) => {
                          const tool = await Tool.findOne({ code: req.params.code });
                            if (!tool) return res.status(404).json({ message: "Tool not found" });
                              res.json(tool);
                              });

                              app.put("/api/tools/:id", async (req, res) => {
                                const { name, code, type, shelf } = req.body;
                                  const tool = await Tool.findByIdAndUpdate(req.params.id, { name, code, type, shelf }, { new: true });
                                    res.json(tool);
                                    });

                                    app.delete("/api/tools/:id", async (req, res) => {
                                      await Tool.findByIdAndDelete(req.params.id);
                                        res.json({ message: "Tool deleted" });
                                        });

                                        const PORT = process.env.PORT || 5000;
                                        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
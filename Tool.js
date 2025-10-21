const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  name: String,
    code: String,
      type: String,
        shelf: String,
          imageURL: String,
            createdAt: { type: Date, default: Date.now }
            });

            module.exports = mongoose.model("Tool", toolSchema);
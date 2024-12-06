const express = require("express");
const app = express();
const PORT = 7000;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const cors = require("cors");
// Ensure 'uploads' directory exists
const uploadDir = "./uploads";
const targetDirectory = "./images"; // Target directory to move files

const builtPath = path.join("../", "./Frontend", "dist");
console.log(builtPath)
app.use(express.static(builtPath));
app.use(cors());
if (!fs.existsSync(targetDirectory)) {
  fs.mkdirSync(targetDirectory, { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory, including parent directories if necessary
}
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Append timestamp to avoid name conflicts
  },
});

// File filter to allow only Excel files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/vnd.ms-excel" || // .xls
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // .xlsx
    file.mimetype === "text/csv" || // .csv
    file.mimetype === "application/csv" // Some systems may use this
  ) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Invalid file type. Only Excel and CSV files are allowed!"),
      false
    ); // Reject file
  }
};

// Initialize multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// API endpoint to upload a single Excel file
app.post("/upload", upload.single("excelFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body.sourceDirectory) {
      return res.status(400).json({ message: "No source directory provided" });
    }
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const foldersToSearch = ["./folder1", "./folder2"]; // Replace with your folders

    const movedImages = [];
    const notFoundImages = [];
    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        try {
          const fullPath = row["Front side Image"]; // Full path from CSV
          const baseName = path.basename(fullPath); // Extract filename (e.g., '1500.jpg')

          const sourcePath = path.join(req.body.sourceDirectory, baseName);
          const targetPath = path.join(targetDirectory, baseName);

          // Check if file exists in the source directory
          if (fs.existsSync(sourcePath)) {
            // Copy the file to the target directory
            fs.copyFileSync(sourcePath, targetPath);

            // Optionally delete the original file (to emulate move)
            // fs.unlinkSync(sourcePath);
            movedImages.push(baseName);
            console.log(`Moved: ${baseName} to ${targetPath}`);
          } else {
            console.log(`File not found: ${baseName}`);
            notFoundImages.push(baseName);
          }
        } catch (error) {
          console.error(`Error processing ${row}: ${error.message}`);
        }
      })
      .on("end", () => {
        res.status(200).json({
          message: "File processed successfully",
          copiedCount: movedImages.length,
          notFoundCount: notFoundImages.length,
          copiedImages: movedImages,
          notFoundImages,
        });
      })
      .on("error", (error) => {
        res.status(500).json({
          message: "Error processing file",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
});
// Handle all other routes and serve React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(builtPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

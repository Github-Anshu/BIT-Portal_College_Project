const express = require("express");
const url = require("url");
const app = express();
const path = require("path");
const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assignments_folder/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Shree Ganesh!!!");
});

app.get("/assignments", (req, res) => {
  const directoryPath = path.join(__dirname, "assignments_folder");
  const { query, pathname } = url.parse(req.url, true);
  // console.log(query.id);
  if (query.id === undefined) {
    res.writeHead(200, { "Content-Type": "text/html" });
    // res.write("Hello World");
    let template1 =
      "<html><body><form action='/assignments' enctype='multipart/form-data' method='POST'> <input type='file' name = 'uploaded_file'><input type = 'submit' value='Upload a file'></body></html>";
    res.write(template1);
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      const pdfFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".pdf"
      );
      console.log(pdfFiles);
      // res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<center><h2>Assignments</h2></center>");

      pdfFiles.forEach((file) => {
        encoded_file_name = encodeURIComponent(file);
        let file_path = "?id=" + encoded_file_name;
        // res.writeHead(200, { "Content-Type": "text/html" });
        // console.log(`<h3><a href =${file_path}>${file}</a></h3>`);
        // res.write("<html><body><h1>Hello World</h1></body></html>");
        res.write(
          `<center><h3><a href =${file_path} target="_blank">${file}</a></h3></center>`
        );
      });
      res.end();
    });
  } else {
    const filePath = path.join(directoryPath, String(query.id));
    fs.readFile(filePath, (err, data) => {
      console.log(filePath);
      res.writeHead(200, { "Content-Type": "application/pdf" });
      res.end(data);
    });
    // res.send(directoryPath);
  }
  // res.end();
});

app.post("/assignments", upload.single("uploaded_file"), (req, res) => {
  // res.json(req.file);
  res.send("Uploaded successfully");
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

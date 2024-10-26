const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// script make folder
app.makeFolder = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    fs.mkdir(path.join(__dirname, folderName), (err) => {
      if (err) return console.error("Failed make Folder:", err);
      console.log("success created new folder :", folderName);
      rl.close();
    });
  });
};

// script make file
app.makeFile = () => {
  rl.question("Masukan Nama File beserta ekstensinya : ", (fileName) => {
    fs.writeFile(path.join(__dirname, fileName), "", (err) => {
      if (err) return console.error("Failed make File:", err);
      console.log("success created new file :", fileName);
      rl.close();
    });
  });
};

// script sort file
app.extSorter = () => {
  const sourceDir = path.join(__dirname, "unorganize_folder");
  fs.readdir(sourceDir, (err, files) => {
    if (err) return console.error("Failed Read Folder", err);

    files.forEach((file) => {
      const ext = path.extname(file).substring(1); // get file extention
      const destDir = path.join(__dirname, ext);

      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

      fs.rename(path.join(sourceDir, file), path.join(destDir, file), (err) => {
        if (err) console.error("Failed move file:", err);
        else console.log(`File ${file} success move to folder ${ext} `);
      });
    });
  });
};

// script read folder
app.readFolder = () => {
  rl.question("Masukan Nama Folder yang ingin dibaca : ", (folderName) => {
    const dirPath = path.join(__dirname, folderName);
    fs.readdir(dirPath, (err, files) => {
      if (err) return console.error("Failed Read Folder", err);

      const fileDetails = files.map((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        return {
          nameFile: file,
          extensi: path.extname(file).substring(1),
          jenisFile: ["jpg", "png"].includes(path.extname(file).substring(1))
            ? "gambar"
            : "text",
          tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
          ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`,
        };
      });

      fileDetails.sort(
        (a, b) => new Date(a.tanggalDibuat) - new Date(b.tanggalDibuat)
      );
      console.log(JSON.stringify(fileDetails, null, 2));
      rl.close();
    });
  });
};

//  script read file
app.readFile = () => {
  rl.question("Masukan Nama File yang ingin dibaca : ", (fileName) => {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) return console.error("Failed Read File", err);
      console.log(`Isi dari file ${fileName}:\n\n${data}`);
      rl.close();
    });
  });
};
// To Do : lanjutkan pembuatan logic disini

module.exports = app;

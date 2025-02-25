const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../public/js');

// Function to check if a file contains jQuery usage without import
function checkFileForJQuery(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const hasJQueryUsage = fileContent.includes('$(') || fileContent.includes('jQuery(');
  const hasJQueryImport = fileContent.includes("import $ from 'jquery';") || fileContent.includes("import jQuery from 'jquery';");

  if (hasJQueryUsage && !hasJQueryImport) {
    console.log(`Missing jQuery import in file: ${filePath}`);
  }
}

// Function to scan directory for JavaScript files
function scanDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        scanDirectory(filePath); // Recursively scan subdirectories
      } else if (path.extname(file) === '.js') {
        checkFileForJQuery(filePath);
      }
    });
  });
}

// Start scanning the directory
scanDirectory(directoryPath);
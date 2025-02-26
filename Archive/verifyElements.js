// verifyElements.js
const fs = require('fs');
const path = require('path');

// Helper function to extract function, class, and variable names from a JS file
function extractElements(fileContent) {
  const elements = new Set();

  // Regex patterns
  const functionPattern = /function\s+(\w+)/g;
  const arrowFunctionPattern = /const\s+(\w+)\s*=\s*\(/g;
  const classPattern = /class\s+(\w+)/g;
  const variablePattern = /(?:const|let|var)\s+(\w+)/g;

  let match;
  while ((match = functionPattern.exec(fileContent))) {
    elements.add(`function: ${match[1]}`);
  }
  while ((match = arrowFunctionPattern.exec(fileContent))) {
    elements.add(`arrow function: ${match[1]}`);
  }
  while ((match = classPattern.exec(fileContent))) {
    elements.add(`class: ${match[1]}`);
  }
  while ((match = variablePattern.exec(fileContent))) {
    elements.add(`variable: ${match[1]}`);
  }

  return elements;
}

// Read and extract elements from main.js
function extractFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return extractElements(content);
}

// Recursively read files from the split directory
function extractFromDirectory(dirPath) {
  const allElements = new Set();
  const fileElements = {};

  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const nestedElements = extractFromDirectory(fullPath);
      Object.entries(nestedElements).forEach(([key, value]) => {
        fileElements[key] = value;
        value.forEach((el) => allElements.add(el));
      });
    } else if (path.extname(fullPath) === '.js') {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const elements = extractElements(content);
      fileElements[file] = elements;
      elements.forEach((el) => allElements.add(el));
    }
  });

  return fileElements;
}

// Compare elements between main.js and split files
function compareElements(mainElements, splitElements) {
  const missingElements = [];
  const foundElements = {};
  
  mainElements.forEach((element) => {
    let foundIn = [];
    Object.entries(splitElements).forEach(([file, elements]) => {
      if (elements.has(element)) {
        foundIn.push(file);
      }
    });
    
    if (foundIn.length === 0) {
      missingElements.push(element);
    } else {
      foundElements[element] = foundIn;
    }
  });
  
  return { missingElements, foundElements };
}

// Main execution
const mainFile = 'C:\\Users\\jack\\OneDrive\\Development\\HTML\\BlankBook\\public\\main.js';
const splitDirectory = 'C:\\Users\\jack\\OneDrive\\Development\\HTML\\BlankBook\\public\\splits';

const mainElements = extractFromFile(mainFile);
const splitFileElements = extractFromDirectory(splitDirectory);
const { missingElements, foundElements } = compareElements(mainElements, splitFileElements);

console.log('\nExtracted elements from main.js:');
mainElements.forEach((el) => console.log(`- ${el}`));

console.log('\nExtracted elements from split files:');
Object.entries(splitFileElements).forEach(([file, elements]) => {
  console.log(`\n${file}:`);
  elements.forEach((el) => console.log(`  - ${el}`));
});

if (missingElements.length === 0) {
  console.log('\nAll elements have been copied successfully! ✅');
} else {
  console.log('\nMissing elements from split files:');
  missingElements.forEach((el) => console.log(`- ${el}`));
}

console.log('\nElement representation across split files:');
Object.entries(foundElements).forEach(([element, files]) => {
  console.log(`${element} -> ${files.join(', ')}`);
});

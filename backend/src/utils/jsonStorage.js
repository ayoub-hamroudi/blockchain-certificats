const fs = require("fs/promises");
const path = require("path");

async function ensureJsonFile(filePath, defaultData) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

async function readJsonFile(filePath, defaultData = []) {
  await ensureJsonFile(filePath, defaultData);

  const content = await fs.readFile(filePath, "utf-8");

  if (!content.trim()) {
    return defaultData;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in file: ${filePath}`);
  }
}

async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  ensureJsonFile,
  readJsonFile,
  writeJsonFile,
};
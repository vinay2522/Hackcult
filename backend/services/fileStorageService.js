const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileStorageService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../uploads');
    this.ensureUploadDirectory();
  }

  async ensureUploadDirectory() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async saveFile(buffer, originalName) {
    const fileHash = this.generateFileHash(buffer);
    const extension = path.extname(originalName);
    const fileName = `${fileHash}${extension}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    return {
      fileHash,
      fileName,
      filePath,
      mimeType: this.getMimeType(extension)
    };
  }

  async getFile(fileHash) {
    const files = await fs.readdir(this.uploadDir);
    const targetFile = files.find(file => file.startsWith(fileHash));
    
    if (!targetFile) {
      throw new Error('File not found');
    }

    const filePath = path.join(this.uploadDir, targetFile);
    const buffer = await fs.readFile(filePath);
    const extension = path.extname(targetFile);

    return {
      data: buffer,
      contentType: this.getMimeType(extension)
    };
  }

  getMimeType(extension) {
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}

module.exports = new FileStorageService();

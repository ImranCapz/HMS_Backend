import multer from 'multer';
import path from 'path';

const maxSize = 30 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/pdf");
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const currentDate = new Date().toISOString().replace(/:/g, '-'); // Generate current date string
        const originalFilename = path.basename(file.originalname, extension); // Extract filename without extension
        const filename = `${originalFilename}--${currentDate}${extension}`; // Concatenate original filename, current date, and extension
        callback(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype === "application/pdf") {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    limits: { fileSize: maxSize }
});

export default upload;

import multer from 'multer';

const storage = multer.memoryStorage(); // store files in memory
const parser = multer({ storage });

export default parser;

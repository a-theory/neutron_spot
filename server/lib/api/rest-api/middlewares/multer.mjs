import multer from "multer";

const limits = {
	// fileSize: 1313131 * 31313131,
	files: 1,
};

export default multer({
    storage: multer.memoryStorage(),
    limits: limits
});



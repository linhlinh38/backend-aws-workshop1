"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const imageController_1 = require("../controllers/imageController");
const router = express_1.default.Router();
exports.router = router;
// const upload = multer({
//   storage: multerConfig.storage,
//   fileFilter: multerConfig.fileFilter,
// });
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/upload", upload.single("file"), imageController_1.uploadImage);
router.get("/getAll", imageController_1.getAllImagePreSignedUrls);
router.post("/delete/:fileName", imageController_1.deleteImage);

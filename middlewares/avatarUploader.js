import path from "node:path";
import { nanoid } from "nanoid";
import multer from "multer";

const storage = multer.diskStorage({
  destination(_, __, cb) {
    cb(null, path.resolve("tmp"));
  },
  async filename(_, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = nanoid();

    const avatar = `${basename}-${suffix}${extname}`;

    cb(null, avatar);
  },
});

export default multer({ storage });

const express = require('express');
const router = express.Router();
const multer=require('multer');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext=file.mimetype.split('/')[1];
      const filename =`user-${Date.now()}.${ext}`;
      cb(null, filename)
    }
  });
  const fileFilter = (req, file, cb) => {
    const imageType=file.mimetype.split('/')[0];
    if(imageType=='image'){
      return cb(null,true)
    }else{
        return cb(appError.create("file must be an image"),false);
    }
  }
  const upload =multer({storage: diskStorage,fileFilter:fileFilter});
const userController = require('../controllers/users.controller');
const validationSchema = require('../middleware/validationSchema');
const verifyToken=require('../middleware/verifyToken');
const appError = require('../utills/appError');



router.route("/").get(verifyToken,userController.getAllUsers);
router.route("/register").post(upload.single('avatar'),userController.register);

router.route("/login").post(userController.login);

// router.route("/:courseid").get(getCourse).patch(updateCourse).delete(deleteCourse);
module.exports = router;

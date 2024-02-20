const express = require('express');
const router = express.Router();
const validationSchema = require('../middleware/validationSchema');
const verifyToken=require('../middleware/verifyToken');

const [
  deleteCourse,
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
] = require('../controllers/courses.controller');
const userRole = require('../utills/useRoles');
const allwedTo = require('../middleware/allwedTo');

router.route("/").post(verifyToken,allwedTo(userRole.MANAGER),validationSchema(), addCourse).get(verifyToken,getAllCourses);
router.route("/:courseid").get(getCourse).patch(updateCourse).delete(verifyToken,allwedTo(userRole.ADMIN,userRole.MANAGER),deleteCourse);

module.exports = router;
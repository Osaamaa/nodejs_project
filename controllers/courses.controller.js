// const courses = require('../data/courses');
const asyncWrapper = require('../middleware/asyncWrapper')
const AppError = require('../utills/appError');

const Course = require('../models/course.model');
const httpStatusText = require('../utills/httpStatusText');
const { body, validationResult } = require('express-validator');
const appError = require('../utills/appError');

const getAllCourses =asyncWrapper( async (req, res) => {
    const query = req.query;
    console.log(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, { '__v': false }).limit(limit).skip(skip);

    res.json({ status: httpStatusText.Success, data: { courses } });
}
)
const getCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseid);
        console.log(req.params.courseid);
        if (!course) {
            const error = appError.create("course not found ", 404, httpStatusText.Fail);
            return next(error);
        }
        return res.json({ status: httpStatusText.Success, data: { course } });

    })
const addCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.Fail);;
            return next(error);
        }
        const newCourse = new Course(req.body)
        await newCourse.save();
        res.status(201).json({ status: httpStatusText.Success, data: { course: newCourse } });
    }
)

const updateCourse = asyncWrapper(async (req, res, next) => {
    const courseid = req.params.courseid;


    const updatedCourse = await Course.findByIdAndUpdate(courseid, { $set: { ...req.body } },);

    return res.status(200).json({ Status: httpStatusText.Success, data: updatedCourse });


}
)
const deleteCourse = asyncWrapper(async (req, res) => {
    const courseid = req.params.courseid;

    const deletedCourse = await Course.deleteOne({ _id: courseid });
    return res.status(200).json({ status: "Success", data: null });

}
)
module.exports = [
    deleteCourse,
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse
]
const asyncHandler = require("../../utils/asyncHandler");
const courseService = require("../../services/admin/course.service");
const { idParams } = require("../../validators/common");
const { createCourseSchema, updateCourseSchema, createSessionSchema } = require("../../validators/course");

const courseId = (req) => idParams("Course id").parse(req.params).id;
const sessionId = (req) => idParams("Session id").parse(req.params).id;

exports.create = asyncHandler(async (req, res) => {
  const input = createCourseSchema.parse({ ...req.body, cover: req.file });
  res.status(201).json(await courseService.create(req.user, input));
});

exports.update = asyncHandler(async (req, res) => {
  const id = courseId(req);
  const input = updateCourseSchema.parse({ ...req.body, cover: req.file });
  res.json(await courseService.update(id, input));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await courseService.remove(courseId(req)));
});

exports.getSessions = asyncHandler(async (req, res) => {
  res.json(await courseService.listSessions());
});

exports.createSession = asyncHandler(async (req, res) => {
  const id = courseId(req);
  const input = createSessionSchema.parse({ ...req.body, video: req.file });
  res.status(201).json(await courseService.createSession(id, input));
});

exports.removeSession = asyncHandler(async (req, res) => {
  res.json(await courseService.removeSession(sessionId(req)));
});

exports.getOptions = asyncHandler(async (req, res) => {
  res.json(await courseService.listOptions());
});
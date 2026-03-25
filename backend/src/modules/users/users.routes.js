const express = require("express");
const router = express.Router();

const usersController = require("./users.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.post("/teacher", usersController.createTeacher);
router.post("/student", usersController.createStudent);
router.get("/teachers", usersController.getTeachers);
router.get("/students", usersController.getStudents);
router.get("/", usersController.getAllUsers);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
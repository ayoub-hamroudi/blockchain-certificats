const usersService = require("./users.service");

async function createTeacher(req, res) {
  try {
    const { name, email, walletAddress } = req.body;

    const user = await usersService.createUser({
      name,
      email,
      walletAddress,
      role: "teacher",
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function createStudent(req, res) {
  try {
    const { name, email, walletAddress } = req.body;

    const user = await usersService.createUser({
      name,
      email,
      walletAddress,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getTeachers(req, res) {
  try {
    const teachers = await usersService.getUsersByRole("teacher");

    return res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getStudents(req, res) {
  try {
    const students = await usersService.getUsersByRole("student");

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const updatedUser = await usersService.updateUser(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const deletedUser = await usersService.deleteUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createTeacher,
  createStudent,
  getTeachers,
  getStudents,
  getAllUsers,
  updateUser,
  deleteUser,
};
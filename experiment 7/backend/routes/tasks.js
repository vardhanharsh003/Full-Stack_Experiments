const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get tasks
router.get("/", authMiddleware, async (req, res) => {
    try {
        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find()
                .populate("assignedTo", "name email")
                .populate("createdBy", "name email");
        } else {
            tasks = await Task.find({
                assignedTo: req.user.id
            });
        }

        res.json(tasks);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get tasks"
        });
    }
});

// Create task - Admin only
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can create tasks"
            });
        }

        const { title, description, assignedTo, priority, deadline } = req.body;

        const task = new Task({
            title,
            description,
            assignedTo,
            createdBy: req.user.id,
            priority,
            deadline
        });

        await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create task"
        });
    }
});

// Edit task - Admin only
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can edit tasks"
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update task"
        });
    }
});

// Delete task - Admin only
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can delete tasks"
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task"
        });
    }
});

// Complete task - Student only
router.patch("/:id/complete", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can complete tasks"
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                assignedTo: req.user.id
            },
            {
                status: "Completed"
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found or not assigned to you"
            });
        }

        res.json({
            message: "Task marked as completed",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete task"
        });
    }
});

module.exports = router;
"use client";
import React, { useState } from "react";

interface TaskFormProps {
  onSubmit: (taskData: TaskData) => void;
}

export interface TaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "To Do" | "In Progress" | "Completed";
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "To Do",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description || !taskData.dueDate) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit(taskData);
    setTaskData({
      title: "",
      description: "",
      dueDate: "",
      priority: "low",
      status: "To Do",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-800 p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      <div className="text-2xl text-white font-semibold mb-4">Add New Task</div>
      <div className="space-y-4">
        {/* Task Title */}
        <div>
          <label htmlFor="title" className="block text-sm text-gray-300">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            className="w-full p-2 mt-1 bg-neutral-700 text-white rounded-md"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Task Description */}
        <div>
          <label htmlFor="description" className="block text-sm text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            className="w-full p-2 mt-1 bg-neutral-700 text-white rounded-md"
            placeholder="Enter task description"
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm text-gray-300">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            className="w-full p-2 mt-1 bg-neutral-700 text-white rounded-md"
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className="w-full p-2 mt-1 bg-neutral-700 text-white rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={taskData.status}
            onChange={handleChange}
            className="w-full p-2 mt-1 bg-neutral-700 text-white rounded-md"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={
              !taskData.title || !taskData.description || !taskData.dueDate
            }
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
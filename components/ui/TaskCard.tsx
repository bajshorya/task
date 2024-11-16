import React from "react";
import { MdDeleteOutline } from "react-icons/md";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "To Do" | "In Progress" | "Completed";
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  onDelete,
  onDragStart,
}) => {
  const priorityColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const statusColors: Record<string, string> = {
    "To Do": "bg-gray-300",
    "In Progress": "bg-blue-500",
    Completed: "bg-green-700",
  };

  return (
    <div
      className="bg-neutral-800 text-white p-4 rounded-lg shadow-md max-w-xs w-full hover:cursor-grab"
      draggable
      onDragStart={() => onDragStart(id)}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm mt-2">{description}</p>

      <div className="flex justify-between mt-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400">Due Date:</span>
          <span>{dueDate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400">Priority:</span>
          <span
            className={`text-white px-2 py-1 rounded-full ${priorityColors[priority]}`}
          >
            {priority}
          </span>
        </div>
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => onDelete(id)}
        >
          <MdDeleteOutline size={24} />
        </div>
      </div>

      <div className="mt-3">
        <span
          className={`text-white text-sm px-3 py-1 rounded-full ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

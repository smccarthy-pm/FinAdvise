import React from 'react';
import { X, Calendar, Clock, Star, Trash2, Edit2 } from 'lucide-react';
import { Task } from '../../types/task';

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetails({ task, isOpen, onClose, onEdit, onDelete }: TaskDetailsProps) {
  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            {task.description && (
              <p className="mt-1 text-gray-600">{task.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
              <span className="text-sm text-gray-600 capitalize">
                {task.priority} Priority
              </span>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <p className="mt-1 text-sm text-gray-600">{task.category}</p>
          </div>

          <div className="bg-gray-50 px-4 py-3 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <p className="mt-1 text-sm text-gray-600">
              {task.completed ? 'Completed' : 'Pending'}
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
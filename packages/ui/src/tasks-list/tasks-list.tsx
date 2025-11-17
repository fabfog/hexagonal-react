export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface TasksListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TasksList({ tasks, onComplete, onDelete }: TasksListProps) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
            task.completed
              ? "bg-gray-50 border-gray-200"
              : "bg-white border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onComplete(task.id)}
              className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span
              className={`flex-1 ${
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </span>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

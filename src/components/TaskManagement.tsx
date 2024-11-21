import React, { useState, useRef, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Plus, 
  Star,
  CalendarDays,
  ChevronDown,
  X,
  Check,
  Calendar,
  ListTodo,
  CheckSquare,
  Square,
  Pencil,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { NewTaskModal } from './tasks/NewTaskModal';
import { TaskDetails } from './tasks/TaskDetails';
import { Task } from '../types/task';
import { isWithinInterval, parseISO, startOfDay, endOfDay, compareAsc, compareDesc } from 'date-fns';
import { useClickAway } from '../hooks/useClickAway';

type ViewMode = 'all' | 'pending' | 'completed';
type SortField = 'dueDate' | 'priority';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review John Smith Portfolio',
      description: 'Quarterly portfolio review and rebalancing recommendations',
      priority: 'high',
      dueDate: '2024-02-20',
      completed: false,
      category: 'Portfolio Review'
    },
    {
      id: '2',
      title: 'Prepare Tax Documents',
      description: 'Gather and organize client tax documents for filing',
      priority: 'medium',
      dueDate: '2024-02-25',
      completed: false,
      category: 'Tax Planning'
    },
    {
      id: '3',
      title: 'Client Meeting Follow-up',
      description: 'Send meeting notes and action items to Sarah Johnson',
      priority: 'high',
      dueDate: '2024-02-18',
      completed: true,
      category: 'Client Communication'
    }
  ]);

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'dueDate', direction: 'asc' });
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    category: [] as string[]
  });

  const filterRef = useRef<HTMLDivElement>(null);
  useClickAway(filterRef, () => setShowFilters(false));

  const categories = useMemo(() => 
    Array.from(new Set(tasks.map(task => task.category))),
    [tasks]
  );

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(false);
    setIsNewTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsTaskDetailsOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleNewTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (selectedTask) {
      // Edit existing task
      setTasks(tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData }
          : task
      ));
      setSelectedTask(null);
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        completed: false
      };
      setTasks([newTask, ...tasks]);
    }
    setIsNewTaskModalOpen(false);
  };

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      if (sortConfig.field === 'dueDate') {
        const compareResult = compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      }
      
      if (sortConfig.field === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const weightA = priorityWeight[a.priority];
        const weightB = priorityWeight[b.priority];
        return sortConfig.direction === 'asc' 
          ? weightA - weightB 
          : weightB - weightA;
      }
      
      return 0;
    });
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply view mode filter
    if (viewMode === 'pending') {
      result = result.filter(task => !task.completed);
    } else if (viewMode === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Apply status filters
    if (filters.status.length > 0) {
      result = result.filter(task => 
        (filters.status.includes('completed') && task.completed) ||
        (filters.status.includes('pending') && !task.completed)
      );
    }

    // Apply priority filters
    if (filters.priority.length > 0) {
      result = result.filter(task => filters.priority.includes(task.priority));
    }

    // Apply category filters
    if (filters.category.length > 0) {
      result = result.filter(task => filters.category.includes(task.category));
    }

    // Apply date range filter
    if (dateRange) {
      result = result.filter(task => {
        const taskDate = parseISO(task.dueDate);
        return isWithinInterval(taskDate, {
          start: startOfDay(parseISO(dateRange.start)),
          end: endOfDay(parseISO(dateRange.end))
        });
      });
    }

    // Apply sorting
    return sortTasks(result);
  }, [tasks, viewMode, filters, dateRange, sortConfig]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setViewMode('pending')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'pending'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setViewMode('completed')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'completed'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filter & Sort
                {(dateRange || Object.values(filters).some(arr => arr.length > 0)) && (
                  <span className="ml-1 w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Filters & Sort</h3>
                      <button 
                        onClick={() => {
                          setFilters({ status: [], priority: [], category: [] });
                          setDateRange(null);
                          setSortConfig({ field: 'dueDate', direction: 'asc' });
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Reset all
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sort by
                        </label>
                        <div className="space-y-2">
                          <button
                            onClick={() => handleSort('dueDate')}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            <span>Due Date</span>
                            {sortConfig.field === 'dueDate' && (
                              sortConfig.direction === 'asc' ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              )
                            )}
                          </button>
                          <button
                            onClick={() => handleSort('priority')}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            <span>Priority</span>
                            {sortConfig.field === 'priority' && (
                              sortConfig.direction === 'asc' ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              )
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <div className="space-y-2">
                          {['high', 'medium', 'low'].map(priority => (
                            <label key={priority} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.priority.includes(priority)}
                                onChange={() => toggleFilter('priority', priority)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">{priority}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <label key={category} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.category.includes(category)}
                                onChange={() => toggleFilter('category', category)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Range
                        </label>
                        <div className="space-y-2">
                          <input
                            type="date"
                            value={dateRange?.start || ''}
                            onChange={(e) => {
                              const start = e.target.value;
                              const end = dateRange?.end || start;
                              setDateRange({ start, end });
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                          />
                          <input
                            type="date"
                            value={dateRange?.end || ''}
                            min={dateRange?.start}
                            onChange={(e) => {
                              const end = e.target.value;
                              const start = dateRange?.start || end;
                              setDateRange({ start, end });
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setSelectedTask(null);
                setIsNewTaskModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border ${
                task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
              } hover:border-indigo-200 transition-colors group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 
                        onClick={() => handleTaskClick(task)}
                        className={`font-medium cursor-pointer hover:text-indigo-600 ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <button
                        onClick={() => handleEditTask(task)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      >
                        <Pencil className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
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
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <CalendarDays className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
              <p className="text-gray-500">
                {Object.values(filters).some(arr => arr.length > 0) || dateRange
                  ? "No tasks match the selected filters"
                  : "Start by creating a new task"}
              </p>
            </div>
          )}
        </div>
      </div>

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleNewTask}
        initialData={selectedTask}
      />

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          isOpen={isTaskDetailsOpen}
          onClose={() => {
            setIsTaskDetailsOpen(false);
            setSelectedTask(null);
          }}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </>
  );
}
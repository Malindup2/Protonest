'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { LogOut, Plus, Search, Filter, ArrowUpDown, Trash2, CheckCircle, Edit } from 'lucide-react';
import TaskModal from '@/components/TaskModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import toast from 'react-hot-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  createdAt: string;
}

interface PageData {
  content: Task[];
  totalPages: number;
  totalElements: number;
  number: number;
  first: boolean;
  last: boolean;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: `${sortField},${sortDir}`,
      });
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, [page, size, sortField, sortDir, statusFilter, priorityFilter]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const statusColors: Record<string, string> = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800'
  };

  const priorityColors: Record<string, string> = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800'
  };

  const confirmDelete = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${taskToDelete}`);
      toast.success("Task deleted successfully!");
      fetchTasks();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete task', error);
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
    }
  };

  const handleMarkDone = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: 'DONE',
        priority: task.priority,
        dueDate: task.dueDate
      });
      toast.success("Task marked as done!");
      fetchTasks();
    } catch (error) {
      console.error('Failed to mark task as done', error);
      toast.error('Failed to mark task as done');
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (!user) return null; // Let the AuthContext handle redirection

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-inner">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">TaskFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Logged in as:</span>
                <span className="ml-1 font-medium text-gray-900">{user.username} <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full ml-1">{user.role}</span></span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={openNewTaskModal}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-md hover:shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Task
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white/80 backdrop-blur p-4 rounded-xl mb-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center text-gray-500 w-full md:w-auto">
              <Filter className="h-5 w-5 mr-2" />
              <span className="font-medium mr-4">Filters:</span>
            </div>
            
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="w-full md:w-48">
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {/* Header for sorting */}
            <li className="bg-gray-50 px-4 py-3 sm:px-6 flex text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-1/3 cursor-pointer flex items-center hover:text-gray-700" onClick={() => handleSort('title')}>
                Task Info <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
              <div className="w-1/6 hidden sm:flex items-center cursor-pointer hover:text-gray-700" onClick={() => handleSort('status')}>
                Status <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
              <div className="w-1/6 hidden sm:flex items-center cursor-pointer hover:text-gray-700" onClick={() => handleSort('priority')}>
                Priority <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
              <div className="w-1/6 hidden md:flex items-center cursor-pointer hover:text-gray-700" onClick={() => handleSort('dueDate')}>
                Due Date <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
              <div className="w-auto ml-auto text-right">
                Actions
              </div>
            </li>

            {loading ? (
              <li className="px-4 py-12 text-center text-gray-500">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </li>
            ) : tasks?.content.length === 0 ? (
              <li className="px-4 py-16 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-1">No tasks found</p>
                  <p className="text-sm text-gray-500 mb-4">Get started by creating a new task.</p>
                  <button
                    onClick={openNewTaskModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    New Task
                  </button>
                </div>
              </li>
            ) : (
              tasks?.content.map((task) => (
                <li key={task.id} className="group">
                  <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <div className="w-1/3 min-w-0 pr-4">
                      <p className="text-sm font-medium text-indigo-600 truncate">{task.title}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500 truncate">
                        {task.description || <span className="italic text-gray-400">No description</span>}
                      </p>
                    </div>
                    
                    <div className="w-1/6 hidden sm:flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="w-1/6 hidden sm:flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="w-1/6 hidden md:flex text-sm text-gray-500">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                       {task.status !== 'DONE' && (
                         <button 
                           onClick={() => handleMarkDone(task)}
                           className="text-gray-400 hover:text-green-500 focus:outline-none" title="Mark as Done"
                         >
                           <CheckCircle className="h-5 w-5" />
                         </button>
                       )}
                       <button 
                         onClick={() => openEditTaskModal(task)}
                         className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1 rounded-full hover:bg-indigo-50 transition-colors" title="Edit"
                       >
                         <Edit className="h-5 w-5" />
                       </button>
                       <button 
                         onClick={() => confirmDelete(task.id)}
                         className="text-gray-400 hover:text-red-600 focus:outline-none p-1 rounded-full hover:bg-red-50 transition-colors" title="Delete"
                       >
                         <Trash2 className="h-5 w-5" />
                       </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          
          {/* Pagination Controls */}
          {tasks && tasks.totalPages > 1 && (
             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={tasks.first}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(tasks.totalPages - 1, p + 1))}
                    disabled={tasks.last}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{tasks.totalPages}</span> ({tasks.totalElements} tasks)
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={tasks.first}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${tasks.first ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(tasks.totalPages - 1, p + 1))}
                        disabled={tasks.last}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${tasks.last ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Task Modal Container */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={fetchTasks} 
        initialData={editingTask} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}

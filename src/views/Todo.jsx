import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import useAxios, { baseURL } from '../utils/useAxios'


function Todo() {

    const api = useAxios();
    const [todo, setTodo] = useState([]);
    const token = localStorage.getItem('authTokens');
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    useEffect(() => {
        fetchTodo();
    }, []);

    const fetchTodo = async () => {
        await api.get(baseURL + '/todo/' + user_id + '/').then((res) => {
            setTodo(res.data);
        });
    }

    const [createTodo, setCreateTodo] = useState({ title: "", completed: "" });

    const handleNewTodoTitle = (event) => {
        setCreateTodo({
            ...createTodo,
            [event.target.name]: event.target.value,
        });
    }

    const formSubmit = () => {
        const formData = new FormData();
        formData.append('user', user_id);
        formData.append('title', createTodo.title);
        formData.append('completed', false);
        try {
            api.post(baseURL + '/todo/' + user_id + '/', formData).then((res) => {
                console.log(res.data);
                Swal.fire({
                    title: "Task Added",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    position: "top-right",
                    timerProgressBar: true,
                });
                fetchTodo();
                createTodo.title = '';
            });
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTodo = async (todo_id) => {
        await api.delete(baseURL + '/todo-detail/' + user_id + '/' + todo_id + '/')
        Swal.fire({
            title: "Task Deleted",
            icon: "success",
            toast: true,
            timer: 2000,
            position: "top-right",
            timerProgressBar: true,
        });
        fetchTodo();
    }

    const TodoCompleted = (todo_id) => {
        api.patch(baseURL + '/todo-completed/' + user_id + '/' + todo_id + '/')
        Swal.fire({
            title: "Task Completed",
            icon: "success",
            toast: true,
            timer: 2000,
            position: "top-right",
            timerProgressBar: true,
        });
        fetchTodo();
    }

    return (
        <div className="h-screen flex items-center justify-center bg-emerald-100">
            <div className="container p-6 bg-white shadow-lg rounded-lg border-violet-700 w-full md:w-1/2 lg:w-1/2">
                <div className="bg-primary text-violet-700 p-4 rounded-t-lg">
                    <h4 className="text-xl font-semibold">My Todo App</h4>
                </div>
                <div className="flex justify-between items-center p-4">
                    <input
                        id="todo-input"
                        name="title"
                        onChange={handleNewTodoTitle}
                        value={createTodo.title}
                        type="text"
                        className="w-full p-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Write a todo..."
                    />
                    <button
                        type="button"
                        onClick={formSubmit}
                        disabled={!createTodo.title.trim()}
                        className="ml-2 p-3 w-1/2 sm:w-1/3 bg-violet-700 text-violet-100 rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        Add todo
                    </button>
                </div>
                <div className="space-y-4">
                    {todo.map((todo) => (
                        <>
                            <div
                                className={`p-4 bg-gray-50 rounded-lg flex justify-between items-center ${todo.completed ? 'line-through text-gray-400' : ''}`}
                                key={todo.id}
                            >
                                <p className="text-lg">{todo.title}</p>
                                <div className="flex space-x-2">
                                    <button
                                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
                                        onClick={() => TodoCompleted(todo.id)}
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                        className="rounded-full bg-red-500 text-white p-3 hover:bg-red-600"
                                        onClick={() => deleteTodo(todo.id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>                        
                            </div>
                            <hr className='text-gray-200 border-dashed border-2'/>
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Todo;

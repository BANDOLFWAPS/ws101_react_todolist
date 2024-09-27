import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoIndex, setCurrentTodoIndex] = useState(null);
  const [editTodo, setEditTodo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const MAX_TODO_LENGTH = 20;

  const isValidTodo = (todo) => {
    const trimmedTodo = todo.trim();
    const minLength = 1;
    const maxLength = MAX_TODO_LENGTH;
    const regex = /^[a-zA-Z\s]+$/; 

    if (!trimmedTodo) {
      return { valid: false, message: 'Task Empty!' };
    } else if (trimmedTodo.length < minLength || trimmedTodo.length > maxLength) {
      return {
        valid: false,
        message: `Task must be between ${minLength} and ${maxLength} characters long!`,
      };
    } else if (!regex.test(trimmedTodo)) {
      return { valid: false, message: 'Task invalid List! Only letters are allowed.' };
    }

    return { valid: true };
  };

  const countWords = (str) => {
    return str
      .trim()
      .split(/\s+/) 
      .filter(word => /^[a-zA-Z]+$/.test(word)).length; 
  };

  const addTodo = () => {
    const validation = isValidTodo(newTodo);
    if (validation.valid) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
      setErrorMessage('');
    } else {
      setErrorMessage(validation.message);
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const startEditTodo = (index) => {
    setIsEditing(true);
    setCurrentTodoIndex(index);
    setEditTodo(todos[index]);
  };

  const updateTodo = () => {
    const validation = isValidTodo(editTodo);
    if (validation.valid) {
      const updatedTodos = todos.map((todo, index) =>
        index === currentTodoIndex ? editTodo : todo
      );
      setTodos(updatedTodos);
      setIsEditing(false);
      setCurrentTodoIndex(null);
      setEditTodo('');
      setErrorMessage('');
    } else {
      setErrorMessage(validation.message);
    }
  };

  const truncate = (task) => {
    if (task.length > 30) {
      return `${task.slice(0, 30)}...`;
    }
    return task;
  };

  return (
    <div className="app-container">
      <h1>BANDOLF TO-DO-LIST</h1>
      <p>Word Count: {countWords(newTodo)}</p>
      <p>
        {newTodo.length > MAX_TODO_LENGTH && (
          <span style={{ color: 'red' }}>
            Maximum limit of {MAX_TODO_LENGTH} characters exceeded!
          </span>
        )}
      </p>
      <div className="input-container">
        <input
          type="text"
          placeholder={`Enter a task (max ${MAX_TODO_LENGTH} chars)`}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTodo(); 
            }
          }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {truncate(todo)} 
            <div>
              <button onClick={() => startEditTodo(index)}>Edit</button>
              <button onClick={() => deleteTodo(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {isEditing && (
        <div className="edit-container">
          <input
            type="text"
            value={editTodo}
            onChange={(e) => setEditTodo(e.target.value)}
          />
          <button onClick={updateTodo}>Update</button>
        </div>
      )}
    </div>
  );
}

export default App;

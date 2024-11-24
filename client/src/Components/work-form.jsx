import React from 'react';

const TaskForm = ({ formData, handleChange, handleSubmit, isEditing, handleCancel }) => {
  const editableFields = isEditing
    ? ['assignedTo', 'dueDate', 'loggedHours', 'status', 'comments']
    : ['taskType', 'projectName', 'assignee', 'assignedTo', 'dueDate', 'budgetHours', 'status'];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      {editableFields.map((key) => (
        <div key={key} className="mb-6">
          <label htmlFor={key} className="block text-lg font-semibold text-gray-800 mb-2">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </label>
          {key === 'status' ? (
            <select
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="bg-blue-50 border border-blue-300 text-blue-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            >
              <option value="TO-DO">TO-DO</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Complete">Complete</option>
              <option value="Done">Done</option>
            </select>
          ) : key === 'comments' ? (
            <textarea
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="bg-green-50 border border-green-300 text-green-900 text-lg rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
              placeholder="Add your comments here..."
            />
          ) : (
            <input
              type="text"
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="bg-blue-50 border border-blue-600 text-yellow-900 text-lg rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
          )}
        </div>
      ))}
      <button type="submit" className="bg-purple-500 text-white text-lg px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out">
        {isEditing ? 'Update' : 'Add Item'}
      </button>
      <button className="bg-purple-500 text-white text-lg px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out" onClick={handleCancel}>Cancel</button>
    </form>
  );
};

export default TaskForm;
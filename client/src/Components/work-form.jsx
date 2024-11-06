import React from 'react';

const TaskForm = ({ formData, handleChange, handleSubmit, isEditing, showForm }) => {
  // Define the fields that should be editable in insert and update modes
  const editableFields = isEditing
    ? [ 'assignedTo', 'dueDate', 'loggedHours', 'status', 'comments']
    : ['taskType', 'projectName', 'assignee', 'assignedTo', 'dueDate', 'budgetHours', 'status'];
 
  return (
   /* <section className='bg-white dark:bg-gray-900 min-h-screen'>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">ADD TASK</div>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
         <div className="p-6 space-y-4 md:space-y-6 sm:p-8"> 
        */
         
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      {editableFields.map((key) => (
        <div key={key} className="mb-4">
          <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </label>
          {key === 'comments' ? (
            <textarea
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <input
              type="text"
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" 
            />
          )}
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        {isEditing ? 'Update' : 'Add Item'}
      </button>
      
    </form>

    

   /* </div>
        </div>
      </div>
    </section> */
  );
};

export default TaskForm;
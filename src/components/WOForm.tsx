// WOForm.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "../common/Button";
// If @tremor/react has individual DatePicker components, you can import them here.
// Otherwise, we'll use standard HTML date inputs.

interface WOFormProps {
  initialData?: Task;
  onSubmit: (formData: Task) => void;
  workTypes: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
  users: { value: string; label: string }[];
  onClose: () => void; // Add this new prop
}

const WOForm: React.FC<WOFormProps> = ({ initialData, onSubmit, workTypes, priorities, users, onClose }) => {
  const [formData, setFormData] = useState<Task>(initialData || {
    title: '',
    description: '',
    workType: '',
    priority: '',
    assignee: '',
    dueDate: {
      start: '',
      end: '',
    },
    workOrderNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handlers for separate date fields
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      dueDate: {
        ...prevData.dueDate,
        start: value,
      },
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      dueDate: {
        ...prevData.dueDate,
        end: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    onSubmit(formData);
    console.log("onSubmit called");
    onClose();
    console.log("onClose called");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Work Type */}
        <div>
          <label htmlFor="workType" className="block text-sm font-medium text-gray-700">Work Type</label>
          <select
            id="workType"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Work Type</option>
            {workTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Priority</option>
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
          <select
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Assignee</option>
            {users.map(user => (
              <option key={user.value} value={user.value}>{user.label}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.dueDate.start}
            onChange={handleStartDateChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.dueDate.end}
            onChange={handleEndDateChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Work Order Number (Read-Only) */}
        {formData.workOrderNumber && (
          <div>
            <label htmlFor="workOrderNumber" className="block text-sm font-medium text-gray-700">Work Order Number</label>
            <input
              type="text"
              id="workOrderNumber"
              name="workOrderNumber"
              value={formData.workOrderNumber}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        )}

        {/* Submit Button */}
        <div>
          <Button type="submit" onClick={() => console.log("Submit button clicked")}>
            {initialData ? 'Update Work Order' : 'Create Work Order'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default WOForm;

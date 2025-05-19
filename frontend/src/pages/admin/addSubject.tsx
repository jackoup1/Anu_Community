// pages/addSubject.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDepartments, createSubject } from '../../api';
import { getUserRole } from '../../utils/auth';

export default function AddSubject() {
  const [name, setName] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = getUserRole();

    if (!token || role !== 'ADMIN') {
      alert('Access denied. Admins only.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    }

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a subject name.');
      return;
    }

    if (selectedDepartments.length === 0) {
      alert('Please select at least one department.');
      return;
    }

    const subjectData = {
      name,
      departmentIds: selectedDepartments,
    };

    try {
      await createSubject(subjectData);
      alert('Subject added successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to add subject.');
    }
  };

  const toggleDepartment = (id: number) => {
    setSelectedDepartments(prev =>
      prev.includes(id) ? prev.filter(depId => depId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Add New Subject</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Select Departments</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {departments.map((dep) => (
                <label key={dep.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={dep.id}
                    checked={selectedDepartments.includes(dep.id)}
                    onChange={() => toggleDepartment(dep.id)}
                  />
                  <span>{dep.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

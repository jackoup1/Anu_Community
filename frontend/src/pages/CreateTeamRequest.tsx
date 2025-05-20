import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignments, createTeamRequest } from '../api';

interface Assignment {
  id: number;
  title: string;
  isTeamBased: boolean;
  maxTeamMembers?: number;
}

const CreateTeamRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    assignmentId: '',
    type: 'JOIN' as 'JOIN' | 'RECRUIT',
    message: '',
    whatsApp: '',
    currentTeamSize: '',
  });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const selectedAssignment = assignments.find(a => a.id === Number(formData.assignmentId));

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments();
        const teamBasedAssignments = data.filter((a: any) => a.isTeamBased);
        setAssignments(teamBasedAssignments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assignments');
      }
    };

    fetchAssignments();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.assignmentId) {
      errors.assignmentId = 'Please select an assignment';
    }

    if (!formData.whatsApp) {
      errors.whatsApp = 'WhatsApp number is required';
    } else if (!/^\+?[0-9\s\-]+$/.test(formData.whatsApp)) {
      errors.whatsApp = 'Please enter a valid WhatsApp number';
    }

    if (formData.type === 'RECRUIT') {
      if (!formData.currentTeamSize) {
        errors.currentTeamSize = 'Current team size is required when recruiting';
      } else {
        const teamSize = Number(formData.currentTeamSize);
        const maxTeamSize = selectedAssignment?.maxTeamMembers;

        if (teamSize < 2) {
          errors.currentTeamSize = 'Team size must be at least 2 when recruiting';
        } else if (maxTeamSize && teamSize >= maxTeamSize) {
          errors.currentTeamSize = `Team size must be less than the maximum allowed (${maxTeamSize})`;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        assignmentId: Number(formData.assignmentId),
        type: formData.type,
        message: formData.message || undefined,
        whatsApp: formData.whatsApp,
        currentTeamSize: formData.currentTeamSize ? Number(formData.currentTeamSize) : undefined,
      };

      await createTeamRequest(requestData);
      navigate('/team-requests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create Team Request</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="assignmentId" className="block text-sm font-medium text-gray-700 mb-1">
            Assignment *
          </label>
          <select
            id="assignmentId"
            name="assignmentId"
            value={formData.assignmentId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title} {assignment.maxTeamMembers ? `(Max ${assignment.maxTeamMembers} members)` : ''}
              </option>
            ))}
          </select>
          {formErrors.assignmentId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.assignmentId}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Request Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="JOIN">I want to join a team</option>
            <option value="RECRUIT">I want to recruit team members</option>
          </select>
        </div>

        {formData.type === 'RECRUIT' && (
          <div>
            <label htmlFor="currentTeamSize" className="block text-sm font-medium text-gray-700 mb-1">
              Current Team Size *
            </label>
            <input
              type="number"
              id="currentTeamSize"
              name="currentTeamSize"
              min="2"
              max={selectedAssignment?.maxTeamMembers ? selectedAssignment.maxTeamMembers - 1 : undefined}
              value={formData.currentTeamSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            {selectedAssignment?.maxTeamMembers && (
              <p className="mt-1 text-sm text-gray-500">
                Maximum team members for this assignment: {selectedAssignment.maxTeamMembers}
              </p>
            )}
            {formErrors.currentTeamSize && (
              <p className="mt-1 text-sm text-red-600">{formErrors.currentTeamSize}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="whatsApp" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number *
          </label>
          <input
            type="text"
            id="whatsApp"
            name="whatsApp"
            value={formData.whatsApp}
            onChange={handleChange}
            placeholder="+1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          {formErrors.whatsApp && (
            <p className="mt-1 text-sm text-red-600">{formErrors.whatsApp}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add any additional information about your request..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/team-requests')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeamRequest;
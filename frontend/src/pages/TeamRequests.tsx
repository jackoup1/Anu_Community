import React, { useEffect, useState } from 'react';
import { getTeamRequests } from '../api';
import { useNavigate } from 'react-router-dom';

interface TeamRequest {
  id: number;
  requester: {
    id: number;
    username: string;
    email: string;
  };
  assignment: {
    id: number;
    title: string;
    isTeamBased: boolean;
    maxTeamMembers?: number;
  };
  type: 'JOIN' | 'RECRUIT';
  message?: string;
  whatsApp?: string;
  currentTeamSize?: number;
  createdAt: string;
}

const TeamRequests: React.FC = () => {
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamRequests = async () => {
      try {
        const data = await getTeamRequests();
        setTeamRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamRequests();
  }, []);

  if (loading) return <div>Loading team requests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Requests</h1>
        <button
          onClick={() => navigate('/create-team-request')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Request
        </button>
      </div>

      <div className="grid gap-6">
        {teamRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No team requests found.</p>
            <button
              onClick={() => navigate('/team-requests/create')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Your First Request
            </button>
          </div>
        ) : (
          teamRequests.map((request) => {
            const needsMoreMembers = request.type === 'RECRUIT' && 
              request.assignment.maxTeamMembers && 
              request.currentTeamSize
              ? request.assignment.maxTeamMembers - request.currentTeamSize
              : null;

            return (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {request.assignment.title}
                      {request.assignment.maxTeamMembers && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Max {request.assignment.maxTeamMembers} members)
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-600">
                      Request by: {request.requester.username}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.type === 'JOIN' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {request.type}
                  </span>
                </div>

                {request.message && (
                  <p className="mb-3">{request.message}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {request.whatsApp && (
                    <div>
                      <span className="font-medium">WhatsApp: </span>
                      {request.whatsApp}
                    </div>
                  )}
                  {request.currentTeamSize && (
                    <div>
                      <span className="font-medium">Current Team Size: </span>
                      {request.currentTeamSize}
                    </div>
                  )}
                  {needsMoreMembers !== null && needsMoreMembers > 0 && (
                    <div className="text-green-600">
                      <span className="font-medium">Needs: </span>
                      {needsMoreMembers} more member{needsMoreMembers !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Created: </span>
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamRequests;
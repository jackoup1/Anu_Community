import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment, getSubjects, uploadPdf } from '../api';
import { FaBook, FaCalendarAlt, FaFilePdf, FaList, FaBookOpen } from 'react-icons/fa';

export default function AddAssignment() {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add an assignment.');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch subjects
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    }
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let pdfUrl = '';
    if (pdfFile) {
      if (pdfFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        return;
      }

      const subjectName = subjects.find(s => s.id === Number(subjectId))?.name;
      if (!subjectName) {
        setError("Subject name couldn't be found.");
        return;
      }

      try {
        const fileData = await uploadPdf(pdfFile, subjectName);
        pdfUrl = fileData.file.path;
      } catch (err: any) {
        setError(`Failed to upload PDF: ${err.message}`);
        return;
      }
    }

    const newAssignment = {
      title,
      description,
      dueDate,
      pdfUrl,
      subjectId: Number(subjectId),
    };

    try {
      await createAssignment(newAssignment);
      alert('Assignment added successfully!');
      navigate('/');
    } catch {
      setError('Failed to add assignment');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">📝 Add New Assignment</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="relative">
            <FaBook className="absolute top-3.5 left-3 text-gray-400" />
            <input
              id="title"
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Subject */}
          <div className="relative">
            <FaBookOpen className="absolute top-3.5 left-3 text-gray-400" />
            <select
              id="subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="pl-10 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="relative">
            <FaList className="absolute top-3.5 left-3 text-gray-400" />
            <textarea
              id="description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-10 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
          </div>

          {/* Due Date */}
          <div className="relative">
            <FaCalendarAlt className="absolute top-3.5 left-3 text-gray-400" />
            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="pl-10 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* PDF Upload */}
          <div className="relative">
            <FaFilePdf className="absolute top-3.5 left-3 text-gray-400" />
            <input
              id="pdfUpload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="pl-10 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment, getSubjects, uploadPdf } from '../api';

export default function AddAssignment() {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
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
        console.log(data);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    }
    fetchSubjects();
  }, []);

  // Upload PDF 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let pdfUrl = '';
    if (pdfFile) {
      if (pdfFile.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
      }

      const subjectName = subjects.find(s => s.id === Number(subjectId))?.name;
      if (!subjectName) {
        alert("Subject name couldn't be found.");
        return;
      }

      try {
        const fileData = await uploadPdf(pdfFile, subjectName);
        pdfUrl = fileData.file.path; 
      } catch (err: any) {
        alert(`Failed to upload PDF: ${err.message}`);
        return;
      }
    }

    const newAssignment = {
      title,
      subjectId: Number(subjectId),
      description,
      dueDate,
      pdfUrl,
    };

    try {
      await createAssignment(newAssignment);
      alert('Assignment added successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to add assignment');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Add New Assignment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="text-lg font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="text-lg font-medium text-gray-700">Subject</label>
            <select
              id="subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <div>
            <label htmlFor="description" className="text-lg font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="text-lg font-medium text-gray-700">Due Date</label>
            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="pdfUpload" className="text-lg font-medium text-gray-700">Upload PDF (Optional)</label>
            <input
              id="pdfUpload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded-lg p-2 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

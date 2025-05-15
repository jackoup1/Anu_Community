import { useEffect, useState } from "react";
import { getAssignments, servePdf, downloadPdf } from "../api";
import { useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
        setFilteredAssignments(data);
      } catch {
        alert("Failed to load assignments");
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (subjectFilter === "All") {
      setFilteredAssignments(assignments);
    } else {
      const filtered = assignments.filter((a) => a.subject.name === subjectFilter);
      setFilteredAssignments(filtered);
    }
  }, [subjectFilter, assignments]);

  const subjectNames = ["All", ...new Set(assignments.map((a) => a.subject?.name))];

  const openModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          📚 Your Assignments
        </h1>

        <div className="mb-6 flex justify-center">
          <label className="mb-2 mr-2 text-lg font-medium text-gray-700 self-start">
            Subject
          </label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-64 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            {subjectNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4">
          {filteredAssignments.map((assignment, idx) => (
            <li
              key={idx}
              className="bg-white border-l-4 border-indigo-500 p-5 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBook className="text-indigo-600 text-xl" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{assignment.title}</p>
                    <p className="text-sm text-gray-500">Subject: {assignment.subject.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-2">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => openModal(assignment)}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}

          {filteredAssignments.length === 0 && (
            <li className="text-center text-gray-500 italic">
              No assignments found for this subject.
            </li>
          )}
        </ul>
      </div>


      <div className="mt-6 text-center">
        <p className="text-lg">See something missing?!</p>
        <button
          onClick={() => navigate("/add-assignment")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add New Assignment
        </button>
      </div>




      {isModalOpen && selectedAssignment && (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Assignment Details</h2>
            <p className="mb-2"><strong>Title:</strong> {selectedAssignment.title}</p>
            <p className="mb-2"><strong>Subject:</strong> {selectedAssignment.subject.name}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedAssignment.description || "No description available"}</p>
            <p className="mb-4"><strong>Due:</strong> {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>

            {selectedAssignment.pdfUrl && (
              <div className="mb-4">
                <p className="mb-1"><strong>Attachment:</strong></p>
                <a
                  href="#"
                  target="_blank"
                  onClick={(e) => {
                    e.preventDefault();
                    servePdf(selectedAssignment.pdfUrl);
                  }}
                  className="text-indigo-600 hover:underline mr-4"
                >
                  View PDF
                </a>
                <a
                  href="#!" // This prevents the default link behavior
                  onClick={() =>downloadPdf (selectedAssignment.pdfUrl)} // Call API before downloading
                  className="text-indigo-600 hover:underline"
                >
                  Download PDF
                </a>
              </div>
            )}



            <div className="text-right">
              <button
                onClick={closeModal}
                className="modal-close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

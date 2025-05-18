import { useEffect, useState } from "react";
import { getAssignments, servePdf, downloadPdf } from "../api";
import { useNavigate } from "react-router-dom";
import { FaBook, FaDownload, FaEye, FaPlus } from "react-icons/fa";

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [tab, setTab] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch {
        alert("you need to login first");
        navigate("/login");
      }
    })();
  }, []);

  const today = new Date();

  const filtered = assignments
    .filter((a) =>
      tab === "All"
        ? true
        : tab === "Upcoming"
        ? new Date(a.dueDate) > today
        : new Date(a.dueDate) <= today
    )
    .filter((a) =>
      subjectFilter === "All" ? true : a.subject?.name === subjectFilter
    )
    .filter((a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );

  const subjectNames = ["All", ...new Set(assignments.map((a) => a.subject?.name))];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
          🎓 Assignments Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["All", "Upcoming", "Past"].map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border border-indigo-200"
              }`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-48"
          >
            {subjectNames.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-64"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-40"
          >
            <option value="asc">Sort: Due Soon</option>
            <option value="desc">Sort: Latest</option>
          </select>
        </div>

        {/* Assignment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((a, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-indigo-700">{a.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">Subject: {a.subject?.name}</p>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    Due: {new Date(a.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedAssignment(a);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Assignments Message */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No assignments found.</p>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => navigate("/add-assignment")}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          <FaPlus />
        </button>

        {/* Modal */}
        {isModalOpen && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">Assignment Details</h3>
              <p><strong>Title:</strong> {selectedAssignment.title}</p>
              <p><strong>Subject:</strong> {selectedAssignment.subject.name}</p>
              <p><strong>Description:</strong> {selectedAssignment.description || "N/A"}</p>
              <p><strong>Due:</strong> {new Date(selectedAssignment.dueDate).toLocaleString()}</p>
              {selectedAssignment.pdfUrl && (
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => servePdf(selectedAssignment.pdfUrl)}
                    className="text-indigo-600 flex items-center gap-1"
                  >
                    <FaEye /> View PDF
                  </button>
                  <button
                    onClick={() => downloadPdf(selectedAssignment.pdfUrl)}
                    className="text-indigo-600 flex items-center gap-1"
                  >
                    <FaDownload /> Download PDF
                  </button>
                </div>
              )}
              <div className="mt-6 text-right">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

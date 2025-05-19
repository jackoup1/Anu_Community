import { useEffect, useState } from "react";
import { getAssignments, servePdf, downloadPdf } from "../api";
import { useNavigate } from "react-router-dom";
import { FaBook, FaDownload, FaEye, FaPlus, FaCalendarAlt, FaFilePdf } from "react-icons/fa";

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [tab, setTab] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    (async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch {
        alert("You need to login first");
        navigate("/login");
      }
    })();
  }, []);

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
   <div className="min-h-screen bg-indigo-50 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">📘 Assignments Dashboard</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {["All", "Upcoming", "Past"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border border-indigo-300"
              }`}
            >
              {t}
            </button>
          ))}

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm"
          >
            {subjectNames.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm w-64"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="asc">Sort: Due Soon</option>
            <option value="desc">Sort: Latest</option>
          </select>
        </div>

        {/* Assignment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a, idx) => {
            const due = new Date(a.dueDate);
            const isOverdue = due < today;

            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition relative"
              >
                <h2 className="text-xl font-semibold text-indigo-700 mb-1 flex items-center gap-2">
                  <FaBook /> {a.title}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Subject: <span className="font-medium">{a.subject?.name}</span>
                </p>
                <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                  <FaCalendarAlt /> Due: {due.toLocaleDateString()}
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${
                  isOverdue ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                }`}>
                  {isOverdue ? "Overdue" : "Upcoming"}
                </span>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedAssignment(a);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                    title="View Details"
                  >
                    <FaEye /> View
                  </button>
                  {a.pdfUrl && (
                    <button
                      onClick={() => servePdf(a.pdfUrl)}
                      className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                      title="View PDF"
                    >
                      <FaFilePdf /> PDF
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No assignments found.
          </p>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => navigate("/add-assignment")}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
          title="Add Assignment"
        >
          <FaPlus />
        </button>

        {/* Modal */}
        {isModalOpen && selectedAssignment && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative">
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">📄 Assignment Details</h3>
              <p className="mb-2"><strong>Title:</strong> {selectedAssignment.title}</p>
              <p className="mb-2"><strong>Subject:</strong> {selectedAssignment.subject.name}</p>
              <p className="mb-2"><strong>Description:</strong> {selectedAssignment.description || "N/A"}</p>
              <p className="mb-2"><strong>Due:</strong> {new Date(selectedAssignment.dueDate).toLocaleString()}</p>

              {selectedAssignment.pdfUrl && (
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => servePdf(selectedAssignment.pdfUrl)}
                    className="text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    <FaEye /> View PDF
                  </button>
                  <button
                    onClick={() => downloadPdf(selectedAssignment.pdfUrl)}
                    className="text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


const BASE_URL = "http://localhost:3000";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/authenticate/login`, {  // No need to include the full URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};


export const signupUser = async (email: string, password: string, username: string, departmentId: Number, level: String) => {
  const res = await fetch(`${BASE_URL}/api/authenticate/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username,departmentId, level }),
  });
  return res.json();
};

export const getAssignments = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/assignments/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};


export const getDepartments = async () => {
  const res = await fetch(`${BASE_URL}/api/departments`);
  if (!res.ok) {
    throw new Error("Failed to fetch departments");
  }
  return res.json(); // returns an array of departments
};


export const createAssignment = async (assignmentData: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/assignments/addAssignment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(assignmentData),
  });

  // Handle different token-related errors
  if (res.status === 401) {
    throw new Error("No token provided or token is missing. Please log in again.");
  }

  if (res.status === 403) {
    throw new Error("Token is invalid or expired. Please log in again.");
  }

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to add assignment");
  }

  return res.json();
};




export const getSubjects = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/subjects/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return res.json(); 
};

export async function createSubject(subjectData: { name: string; departmentIds: number[] }) {
  const res = await fetch(`${BASE_URL}/api/subjects/addSubject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(subjectData),
  });
  if (!res.ok) throw new Error('Failed to create subject');
  return await res.json();
}

// API call to upload PDF file
export const uploadPdf = async (file: File, subjectName: string) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append('subjectName', subjectName);
  formData.append('pdfFile', file);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to upload PDF");
  }

  return res.json();
};



export const servePdf = async (pdfUrl: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/pdf/${pdfUrl}`);
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  } catch (error) {
    console.error("Error serving PDF:", error);
  }
};


export const downloadPdf = async (pdfUrl: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/upload/${pdfUrl}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Bc_sheet.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading the PDF', error);
  }
};
export const addComment = async (assignmentId: number, content: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/assignments/addComment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ assignmentId, content }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add comment");
  }

  return res.json();
};
export const getComments = async (assignmentId: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/assignments/${assignmentId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch comments");
  }

  return res.json();
};


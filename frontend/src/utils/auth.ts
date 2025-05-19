import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  level: number;
  departmentId: number;
  exp: number;
}

export function getUserInfo(): { id: number; role: string } | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return { id: decoded.id, role: decoded.role };
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

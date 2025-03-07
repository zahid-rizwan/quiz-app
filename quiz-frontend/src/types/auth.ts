export interface User {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  studentId: string;
  image: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  program: string;
  year: number;
  studentId: string;
}
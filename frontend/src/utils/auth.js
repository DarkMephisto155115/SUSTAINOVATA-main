export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getUser() {
  const data = localStorage.getItem('user') || sessionStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}
export function getRemember() {
    const data = localStorage.getItem('savedUser');
    return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

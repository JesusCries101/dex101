interface ActionLogin {
  type: 'login';
  payload: (
    {
      authorized: true;
      email: string;
      password: string;
    } | {
      authorized: false;
    }
  );
}
export function login(email: string, password: string): ActionLogin {
  return {
    type: 'login',
    payload: { email, password, authorized: true }
  };
}
export function logout(): ActionLogin {
  return {
    type: 'login',
    payload: { authorized: false }
  };
}
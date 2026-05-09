const listeners = new Set();

export const addToastListener = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notify = (type, message) => {
  const id = Date.now() + Math.random();
  listeners.forEach((listener) => listener({ id, type, message }));
};

const toast = {
  success: (message) => notify("success", message),
  error: (message) => notify("error", message),
};

export default toast;

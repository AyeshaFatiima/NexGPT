import { useEffect, useState } from "react";
import { addToastListener } from "./toastStore.js";

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return addToastListener((nextToast) => {
      setToasts((currentToasts) => [...currentToasts, nextToast]);
      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toastItem) => toastItem.id !== nextToast.id)
        );
      }, 3000);
    });
  }, []);

  return (
    <div className="toastContainer" aria-live="polite" aria-atomic="true">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`toastItem ${toastItem.type === "error" ? "error" : "success"}`}
        >
          {toastItem.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

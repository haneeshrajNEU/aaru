import { useEffect } from "react";
import { useUIStore } from "../store/useUIStore";

export default function ToastStack() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => dismissToast(t.id), 3200)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismissToast]);

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span className="icon">{t.icon}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

export function pushItemToast(item) {
  useUIStore.getState().pushToast({ icon: item.icon, label: `${item.name} added to satchel` });
}

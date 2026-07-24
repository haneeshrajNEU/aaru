import { useUIStore } from "../store/useUIStore";

export default function Modal() {
  const modal = useUIStore((s) => s.modal);
  const closeModal = useUIStore((s) => s.closeModal);

  if (!modal) return null;

  const handleContinue = () => {
    modal.onContinue?.();
    closeModal();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{modal.title}</h2>
        <div className="modal-body">{modal.body}</div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={handleContinue} autoFocus>
            {modal.continueLabel || "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

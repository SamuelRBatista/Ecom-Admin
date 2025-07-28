
import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">
            <h2>{title}</h2>
        </div>
        
        <p>{message}</p>
        <div className="button-group">
          <button onClick={onConfirm} className="btn btn-danger">Excluir</button>
          <button onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

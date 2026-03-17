export default function ConfirmModal({
  text,
  onConfirm,
  onCancel,
}) {

  return (

    <div
      className="modal-overlay"
      onClick={onCancel}
    >

      <div
        className="modal-card"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="modal-title">
          Confirm
        </div>


        <div
          style={{
            marginBottom: 10,
          }}
        >
          {text}
        </div>


        <div className="modal-actions">

          <button
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>


          <button
            className="btn-save"
            onClick={onConfirm}
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  );

}
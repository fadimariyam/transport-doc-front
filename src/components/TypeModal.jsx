import { useState } from "react";

export default function TypeModal({
  close,
  addType,
}) {
  const [text, setText] = useState("");

  const save = () => {
    if (!text) return;
    addType(text);
    close();
  };

  return (

    <div
      className="modal-overlay"
      onClick={close}
    >

      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-title">
          Add Equipment Type
        </div>

        <input
          className="modal-input"
          placeholder="Type name"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />

        <div className="modal-actions">

          <button
            className="btn-cancel"
            onClick={close}
          >
            Cancel
          </button>

          <button
            className="btn-save"
            onClick={save}
          >
            Add
          </button>

        </div>

      </div>

    </div>

  );
}
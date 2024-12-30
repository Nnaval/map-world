import React from "react";

const Modal = ({
  open,
  onClose,
  width = "900px",
  height = "400px",
  children,
}) => {
  if (!open) return null; // Don't render if not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content bg-dark-1 text-light-1"
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling up to the overlay
      >
        <button className="close-button" onClick={onClose}>
          &times; {/* Close button */}
        </button>
        {children}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 30; // Ensure it overlays other content
        }
        .modal-content {
          background: "#121417";
          color: "#FFFFFF";
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative; // Ensure the close button is positioned correctly
          padding: 20px;
          max-width: 100%;
          max-height: 100%;
          overflow: auto; // Allow scrolling if content is too long
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Modal;

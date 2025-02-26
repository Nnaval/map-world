"use client";
import { useState } from "react";
import Modal from "./Modal";
import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";

const FindEntityModal = ({ showModal, setShowModal }) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const { viewer } = useCesiumViewer();

  const findEntity = () => {
    if (!viewer) return;
    const searchName = `User: ${username.trim()}`;

    // Search for the entity
    const entity = viewer.entities.values.find(
      (entity) => entity.name === searchName
    );

    if (entity) {
      // Center camera on found entity
      viewer.flyTo(entity);
    } else {
      setMessage("user not found in space");
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      width="fit"
      height="fit"
    >
      <h6 className="text-xl font-semibold">Find a Mate on the Space</h6>
      <h6 className="text-slate-500 text-sm">
        Input the Username of whom you are looking for
      </h6>
      <div className="flex flex-col gap-4 justify-center">
        <div className="flex flex-col gap-3 py-4">
          <label htmlFor="name" className="text-sm text-black">
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter username only"
            className="bg-slate-200 w-full border-b outline-none text-sm p-2"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setMessage("");
            }}
          />
        </div>
        {message && <p className="text-red-500 text-xs">{message}</p>}
        <button
          className="bg-primary text-white p-1 rounded-lg px-4"
          onClick={findEntity}
        >
          Find
        </button>
      </div>
    </Modal>
  );
};

export default FindEntityModal;

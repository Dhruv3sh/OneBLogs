import React from "react";

const Modal = ({ children, modal, setModal,visibility }) => {
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className={`bg-white/95 fixed inset-0 z-10 
      ${
        modal ? `visible opacity-${visibility}` : "invisible opacity-0"
      } transition-all duration-300`}
      />
      {children}
    </>
  );
};

export default Modal;

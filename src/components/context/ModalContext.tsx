import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
      {isModalOpen && <Modal />}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const Modal: React.FC = () => {
  const { closeModal } = useModal();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-11/12 max-w-md lg:max-w-lg flex flex-col items-center">
        <h2 className="text-lg md:text-xl lg:text-2xl text-background font-bold font-Lato mb-4 text-center mt-[-10px]">
          Create a post
        </h2>
        <button onClick={closeModal} className="absolute top-2 right-2 text-white">
          &times;
        </button>
        {/* Modal content goes here */}
      </div>
    </div>
  );
};

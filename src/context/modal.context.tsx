"use client";

import React, {
  createContext,
  Fragment,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Modal from "../components/modal/modal";

interface OpenModalType {
  modalType: string;
  data?: unknown;
  modalNodeData?: React.ReactNode;
}

interface ModalContextType {
  isOpen: boolean;
  modalData: {
    modalType: string | undefined;
    data?: unknown;
    modalNodeData?: React.ReactNode;
  };
  toggleModal: () => void;
  openModal: (openModal: OpenModalType) => void;
  closeModal: () => void;
  closeAllModal: () => void;
}

const defaultValue: ModalContextType = {
  isOpen: false,
  modalData: {
    modalType: undefined,
    data: undefined,
    modalNodeData: <Fragment />,
  },
  toggleModal: () => void {},
  openModal: ({ modalType }: OpenModalType) => void {},
  closeModal: () => void {},
  closeAllModal: () => void {},
};

const ModalContext = createContext<ModalContextType>(defaultValue);

interface Props {
  children: ReactNode;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [modalData, setModalData] = useState<{
    modalType: string | undefined;
    data?: unknown;
    modalNodeData?: React.ReactNode;
  }>({ modalType: undefined, data: undefined });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const openModal = ({ modalType, data, modalNodeData }: OpenModalType) => {
    setModalData({ modalType, data, modalNodeData });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData({ modalType: undefined, data: undefined });
  };

  const closeAllModal = () => {
    setModalData({ modalType: undefined, data: undefined });
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen: isOpen,
        modalData,
        toggleModal,
        openModal,
        closeModal,
        closeAllModal,
      }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useValue must be used within a ValueProvider");
  }
  return context;
};

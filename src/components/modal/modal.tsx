import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";
import { useModal } from "../../context/modal.context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Modal = () => {
  const { isOpen, closeModal, modalData } = useModal();

  const { data, modalType, modalNodeData } = modalData;
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="border-gray-700 bg-nav-gradient bg-primary-network">
        {modalNodeData ?? <></>}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/modal"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"


type Props = {
  // email: string;
}

export type DeleteModalRef = {
  open: (email: string) => void;
  close: () => void;
};

export const DeleteModal = forwardRef<DeleteModalRef, Props>((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<any>();
  const [email, setEmail] = useState("");

  useImperativeHandle(ref, () => ({
    open: (email) => {
      setEmail(email);
      onOpen();
    },
    close: onClose,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const onDeleteConfirm = () => {
    
    onClose();
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete {email}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={onDeleteConfirm} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
});

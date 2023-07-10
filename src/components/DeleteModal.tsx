import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/modal"
import { useFirestoreDocumentDeletion } from "@react-query-firebase/firestore"
import { doc } from "firebase/firestore"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { accountCollection } from "../lib/Firebase"
import { useToast } from "@chakra-ui/react"

type Props = {
  // email: string;
}

export type DeleteModalRef = {
  open: (account: AccountWithId) => void;
  close: () => void;
};

export const DeleteModal = forwardRef<DeleteModalRef, Props>((props, ref) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<any>();
  const [account, setAccount] = useState<AccountWithId | null>(null);
  const { mutate } = useFirestoreDocumentDeletion(doc(accountCollection, account?.id || "-"), {
    onSuccess: () => {
      toast({
        title: 'Account delete.',
        description: "We've deleted your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
    }
  });

  useImperativeHandle(ref, () => ({
    open: (account) => {
      setAccount(account);
      onOpen();
    },
    close: onClose,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const onDeleteConfirm = () => {
    mutate();
    onClose();
  }

  const reset = () => {
    setAccount(null);
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
            Delete {account?.email}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={reset}>
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

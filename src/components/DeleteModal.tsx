import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay } from "@chakra-ui/modal"
import { useToast } from "@chakra-ui/react"
import { useFirestoreDocumentDeletion } from "@react-query-firebase/firestore"
import { doc } from "firebase/firestore"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import useLocalStorage from "use-local-storage"
import { accountCollection } from "../lib/Firebase"

type Props = {
  // email: string;
}

export type DeleteModalRef = {
  open: (type: AccountType, account: AccountWithId) => void;
  close: () => void;
};

export const DeleteModal = forwardRef<DeleteModalRef, Props>((props, ref) => {
  const toast = useToast();
  const cancelRef = useRef<any>();
  const [type, setType] = useState<AccountType>("shared");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [personalAccounts, setPersonalAccounts] = useLocalStorage<AccountWithId[]>("accounts", []);
  const [account, setAccount] = useState<AccountWithId | null>(null);

  const { mutate: deleteAsync } = useFirestoreDocumentDeletion(doc(accountCollection, account?.id || "-"), {
    onSuccess: () => {
      toast({
        title: 'Account deleted.',
        description: "We've deleted your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
    }
  });

  useImperativeHandle(ref, () => ({
    open: (type, account) => {
      setAccount(account);
      setType(type);
      onOpen();
    },
    close: onClose,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const onDeleteConfirm = () => {
    if (!account) {
      return console.log("Error - account is null");
    }

    if (type === "personal") {
      const findId = personalAccounts?.findIndex(item => item.id === account.id);
      if (findId < 0) {
        return toast({
          title: "Something wrong",
          description: `Can't find local account - ${account.id}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setPersonalAccounts(prev => {
        const clone = [...(prev ?? [])];
        clone.splice(findId, 1);
        return clone;
      });
    } else {
      deleteAsync();
    }

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

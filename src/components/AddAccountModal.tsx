import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import { useFirestoreCollectionMutation, useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { forwardRef, useImperativeHandle, useState } from "react";
import { accountCollection } from "../lib/Firebase";
import { doc } from "firebase/firestore";

type Props = {
  // isOpen: boolean;
  // onClose: () => void;
}

export type AddAccountModalRef = {
  open: (account?: AccountWithId) => void;
  close: () => void;
};

const DEFAULT_RANDOM_ID = "1111111112222222223333333334444444"

export const AddAccountModal = forwardRef<AddAccountModalRef, Props>((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("")
  const [secret, setSecret] = useState("");
  const [tag, setTag] = useState("");
  const [notes, setNotes] = useState("");
  const [id, setId] = useState("");
  const toast = useToast();
  const isAdd = !id;
  const editDocRef = doc(accountCollection, id || DEFAULT_RANDOM_ID);
  const { mutate: edit } = useFirestoreDocumentMutation(editDocRef, {}, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      toast({
        title: "Account updated.",
        description: "We've updated your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClosePress();
    }
  });

  const { mutate } = useFirestoreCollectionMutation(accountCollection, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClosePress();
    }
  });

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "email" | "secret" | "tag" | "notes") => {
    switch (type) {
      case "email":
        return setEmail(event.target.value);
      case "secret":
        return setSecret(event.target.value);
      case "tag":
        return setTag(event.target.value);
      case "notes":
        return setNotes(event.target.value);
    }
  }

  useImperativeHandle(ref, () => ({
    open: (account) => {
      if (account) {
        const { id, email, secret, tag = [], notes = "" } = account;
        setId(id);
        setEmail(email);
        setSecret(secret);
        setTag(tag?.join(","));
        setNotes(notes);
      }
      onOpen();
    },
    close: onClose,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const onConfirmPress = () => {
    if (!email || !secret) return;
    if (isAdd) {
      return mutate({ email, secret, tag: tag.split(",").map(item => item.trim()), notes } as any);
    }

    if (!id) return console.log(`Something went wrong.. ${id}`);
    return  ({ email, secret, tag, notes } as any);
  }

  const reset = () => {
    setEmail("");
    setSecret("");
    setTag("");
    setNotes("");
  }

  const onClosePress = () => {
    onClose();
    reset();
  }

  return (<Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{isAdd ? "Add" : "Modify"} Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input placeholder="Email" value={email} onChange={event => onHandleChange(event, "email")} marginBottom={2} />
        <Input placeholder="Secret key" value={secret} onChange={event => onHandleChange(event, "secret")} marginBottom={2} />
        <Input placeholder="Tag (optional)" value={tag} onChange={event => onHandleChange(event, "tag")} marginBottom={2} />
        <Textarea placeholder="Notes (optional)" value={notes} onChange={event => onHandleChange(event, "notes")} />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant="ghost" disabled={!email || !secret} onClick={onConfirmPress}>{isAdd ? "Confirm" : "Update"}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>)
});

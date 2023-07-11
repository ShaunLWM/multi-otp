import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useToast } from "@chakra-ui/react";
import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { FC, useState } from "react";
import { accountCollection } from "../lib/Firebase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAccountModal: FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("")
  const [secret, setSecret] = useState("");
  const [tag, setTag] = useState("");
  const [notes, setNotes] = useState("");
  const toast = useToast();
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

  const onConfirmPress = () => {
    if (!email || !secret) return;
    mutate({ email, secret, tag, notes } as any);
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
      <ModalHeader>Add Account</ModalHeader>
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
        <Button variant="ghost" disabled={!email || !secret} onClick={onConfirmPress}>Confirm</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>)
}

import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
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
  const toast = useToast();
  const { mutate } = useFirestoreCollectionMutation(accountCollection, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      setEmail("");
      setSecret("");
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    }
  });

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'email') {
      setEmail(event.target.value)
    } else {
      setSecret(event.target.value)
    }
  }

  const onConfirmPress = () => {
    if (!email || !secret) return;
    mutate({ email, secret });
  }

  return (<Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input placeholder="Email" value={email} onChange={event => onHandleChange(event, "email")} marginBottom={2}/>
        <Input placeholder="Secret key" value={secret} onChange={event => onHandleChange(event, "secret")} />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant="ghost" disabled={!email || !secret} onClick={onConfirmPress}>Confirm</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>)
}

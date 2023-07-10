import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from "@chakra-ui/react"
import { FC, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAccountModal: FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [secretKey, setSecretKey] = useState('');

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'email') {
      setEmail(event.target.value)
    } else {
      setSecretKey(event.target.value)
    }
  }

  const onConfirmPress = () => {
    if (!email || !secretKey) return;

  }

  return (<Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input placeholder="Email" value={email} onChange={event => onHandleChange(event, "email")} />
        <Input placeholder="Secret key" value={secretKey} onChange={event => onHandleChange(event, "secretKey")} />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant='ghost' disabled={!email || !secretKey} onClick={onConfirmPress}>Confirm</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>)
}

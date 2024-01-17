import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import { useFirestoreCollectionMutation, useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { forwardRef, useImperativeHandle, useState } from "react";
import useLocalStorage from "use-local-storage";
import { accountCollection } from "../lib/Firebase";

type Props = {
  // isOpen: boolean;
  // onClose: () => void;
}

export type AddAccountModalRef = {
  open: (type: AccountType, account?: AccountWithId) => void;
  close: () => void;
};

const DEFAULT_RANDOM_ID = "1111111112222222223333333334444444"

export const AddAccountModal = forwardRef<AddAccountModalRef, Props>((props, ref) => {
  const [personalAccounts, setPersonalAccounts] = useLocalStorage<AccountWithId[]>("accounts", []);

  const toast = useToast();
  const [id, setId] = useState("");
  const [tag, setTag] = useState("");
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("");
  const [secret, setSecret] = useState("");
  const [type, setType] = useState<AccountType>("shared");
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const { mutate: add } = useFirestoreCollectionMutation(accountCollection, {
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

  const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value as AccountType)
  }

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
    open: (type: AccountType, account?: AccountWithId) => {
      console.log(account, type);
      if (account) {
        const { id, email, secret, tag = [], notes = "" } = account;
        setId(id);
        setEmail(email);
        setSecret(secret);
        setTag(tag?.join(","));
        setNotes(notes);
      } else {
        reset();
      }

      setType(type);
      onOpen();
    },
    close: onClose,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const onConfirmPress = () => {
    if (!email || !secret) return;

    if (isAdd) {
      if (type === "shared") {
        add({ email, secret, tag: tag.split(",").map(item => item.trim()), notes } as any);
      } else {
        setPersonalAccounts(prev => [...(prev ?? []), {
          id: nanoid(),
          email,
          secret,
          tag: tag.split(",").map(item => item.trim()),
          notes,
        }]);
      }

      return onClosePress();
    }

    // Edit
    if (!id) {
      return console.log(`Something went wrong.. ${id}`);
    }

    if (type === "shared") {
      edit({ email, secret, tag: tag.split(",").map(item => item.trim()), notes } as any);
    } else {
      const findId = personalAccounts?.findIndex(item => item.id === id);
      if (findId < 0) {
        return toast({
          title: "Something wrong",
          description: `Can't find local account - ${id}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setPersonalAccounts(prev => {
        const clone = [...(prev ?? [])];
        clone[findId] = {
          ...clone[findId],
          email,
          secret,
          tag: tag.split(",").map(item => item.trim()),
          notes,
        }

        return clone;
      });
    }

    return onClosePress();
  }

  const reset = () => {
    setId("");
    setEmail("");
    setSecret("");
    setTag("");
    setNotes("");
    setType("shared");
  }

  const onClosePress = () => {
    reset();
    onClose();
  }

  return (<Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{isAdd ? "Add" : "Modify"} Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Select onChange={onTypeChange} value={type} marginBottom={2}>
          <option value="shared">Shared</option>
          <option value="personal">Personal</option>
        </Select>
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

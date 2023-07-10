import { Container, Select, useDisclosure } from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';
import { Account } from './components/Account';
import { AddAccountModal } from './components/AddAccountModal';
import { AddFab } from './components/AddFab';
import { DeleteModal, DeleteModalRef } from './components/DeleteModal';
import { useAccounts } from './hooks/useAccounts';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModalRef = useRef<DeleteModalRef | null>(null);
  const [currentTag, setCurrentTag] = useState("All");

  const { data, isLoading } = useAccounts();
  const { accounts, tags } = data || {};
  const filteredAccounts = accounts?.filter(account => currentTag !== "All" ? account.tag?.toLowerCase() === currentTag : true);

  const onHandleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentTag(event.target.value)
  }

  const onDeletePress = (email: string) => {
    deleteModalRef.current?.open(email);
  }

  return (
    <Container height="100vh" width="100vw" padding={2} gap={2}>
      <AddFab onClick={onOpen} />
      <Select value={currentTag} onChange={onHandleTagChange}>
        {tags?.map(tag => <option value={tag}>{tag}</option>)}
      </Select>
      {!isLoading && filteredAccounts?.map(account => <Account account={account} onDeletePress={onDeletePress} />)}
      <AddAccountModal isOpen={isOpen} onClose={onClose} />
      <DeleteModal ref={deleteModalRef} />
    </Container>
  );
}

export default App;

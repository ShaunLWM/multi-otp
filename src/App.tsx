import { Container, useDisclosure } from '@chakra-ui/react';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { useRef } from 'react';
import { Account } from './components/Account';
import { AddAccountModal } from './components/AddAccountModal';
import { AddFab } from './components/AddFab';
import { DeleteModal, DeleteModalRef } from './components/DeleteModal';
import { accountCollectionRef } from './lib/Firebase';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModalRef = useRef<DeleteModalRef | null>(null);
  const { isLoading, data } = useFirestoreQueryData<Account>(["products"], accountCollectionRef, { subscribe: true });

  const onDeletePress = (email: string) => {
    deleteModalRef.current?.open(email);
  }

  return (
    <Container height="100vh" width="100vw">
      <AddFab onClick={onOpen} />
      {!isLoading && data && data.map(account => <Account account={account} onDeletePress={onDeletePress} />)}
      <AddAccountModal isOpen={isOpen} onClose={onClose} />
      <DeleteModal ref={deleteModalRef} />
    </Container>
  );
}

export default App;

import { Container, Progress, Select } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Account } from './components/Account';
import { AddAccountModal, AddAccountModalRef } from './components/AddAccountModal';
import { AddFab } from './components/AddFab';
import { DeleteModal, DeleteModalRef } from './components/DeleteModal';
import { useAccounts } from './hooks/useAccounts';
import { getCurrentSeconds } from './lib/Helper';

const PERIOD = 30;

function App() {
  const deleteModalRef = useRef<DeleteModalRef | null>(null);
  const addModalRef = useRef<AddAccountModalRef | null>(null);
  const [currentTag, setCurrentTag] = useState("All");
  const [updatingIn, setUpdatingIn] = useState(30);

  const { data, isLoading } = useAccounts();
  const { accounts, tags } = data || {};
  const filteredAccounts = accounts?.filter(account => currentTag !== "All" ? account.tag?.some(tag => tag?.toLowerCase() === currentTag.toLowerCase()) : true);

  const onHandleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentTag(event.target.value)
  }

  const onDeletePress = (account: AccountWithId) => {
    deleteModalRef.current?.open(account);
  }

  const onAddModalPress = (account?: AccountWithId) => {
    addModalRef.current?.open(account);
  }

  const update = useCallback(() => {
    const countdown = PERIOD - (getCurrentSeconds() % PERIOD);
    setUpdatingIn(countdown);
  }, []);

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalHandle = setInterval(update, 1000);
    return () => clearInterval(intervalHandle);
  }, [update]);

  return (
    <Container height="100vh" width="100vw" padding={2} gap={2}>
      <AddFab onClick={onAddModalPress} />
      <Select value={currentTag} onChange={onHandleTagChange}>
        {tags?.map(tag => <option key={tag} value={tag}>{tag}</option>)}
      </Select>
      {filteredAccounts && filteredAccounts?.length > 0 && <Progress value={updatingIn / (PERIOD * 1.0) * 100} size="xs" colorScheme="pink" marginTop={2} marginBottom={2} />}
      {!isLoading && filteredAccounts?.map((account, index) => <Account key={`account-${account.email}-${index}`} account={account} onDeletePress={onDeletePress} onEditPress={onAddModalPress} />)}
      <AddAccountModal ref={addModalRef} />
      <DeleteModal ref={deleteModalRef} />
    </Container>
  );
}

export default App;

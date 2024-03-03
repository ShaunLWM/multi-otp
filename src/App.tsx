import { Container, Progress, Select, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import { Account } from './components/Account';
import { AddAccountModal, AddAccountModalRef } from './components/AddAccountModal';
import { AddFab } from './components/AddFab';
import { DeleteModal, DeleteModalRef } from './components/DeleteModal';
import { Footer } from './components/Footer';
import { PersonalTab } from './components/PersonalTab';
import { useAccounts } from './hooks/useAccounts';
import { getCurrentSeconds } from './lib/Helper';

const PERIOD = 30;

function App() {
  const [tabIndex, setTabIndex] = useState(0)
  const [updatingIn, setUpdatingIn] = useState(30);
  const [currentTag, setCurrentTag] = useState("All");
  const deleteModalRef = useRef<DeleteModalRef | null>(null);
  const addModalRef = useRef<AddAccountModalRef | null>(null);

  const { data, isLoading } = useAccounts();
  const { accounts, tags } = data || {};
  const [localAccounts] = useLocalStorage<AccountWithId[]>("accounts", []);
  const filteredAccounts = [...(accounts ?? []), ...localAccounts]?.filter(account => currentTag !== "All" ? account.tag?.some(tag => tag?.toLowerCase() === currentTag.toLowerCase()) : true);

  const onHandleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentTag(event.target.value)
  }

  const onDeletePress = (type: AccountType, account: AccountWithId,) => {
    deleteModalRef.current?.open(type, account);
  }

  const onAddModalPress = (type: AccountType, account?: AccountWithId) => {
    addModalRef.current?.open(type, account);
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
      <AddFab onClick={() => onAddModalPress(tabIndex === 0 ? "shared" : "personal")} />
      <Select value={currentTag} onChange={onHandleTagChange}>
        {tags?.map(tag => <option key={tag} value={tag}>{tag}</option>)}
      </Select>
      {filteredAccounts && filteredAccounts?.length > 0 && <Progress value={updatingIn / (PERIOD * 1.0) * 100} size="xs" colorScheme="pink" marginTop={2} marginBottom={2} />}
      <Tabs onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Shared</Tab>
          <Tab>Personal</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {!isLoading && filteredAccounts?.map((account, index) => <Account key={`account-${account.email}-${index}`} account={account} onDeletePress={(acc) => onDeletePress("shared", acc)} onEditPress={acc => onAddModalPress("shared", acc)} />)}
          </TabPanel>
          <PersonalTab onDeletePress={(acc) => onDeletePress("personal", acc)} onEditPress={acc => onAddModalPress("personal", acc)} />
        </TabPanels>
      </Tabs>

      <AddAccountModal ref={addModalRef} />
      <DeleteModal ref={deleteModalRef} />
      <Footer />
    </Container>
  );
}

export default App;

import { TabPanel, Text } from "@chakra-ui/react";
import { FC } from "react";
import useLocalStorage from "use-local-storage";
import { Account } from "./Account";

interface PersonalTabProps {
  onDeletePress: (account: AccountWithId) => void;
  onEditPress: (account?: AccountWithId) => void;
}

export const PersonalTab: FC<PersonalTabProps> = (props) => {
  const { onDeletePress, onEditPress } = props;
  const [accounts] = useLocalStorage<AccountWithId[]>("accounts", []);
  return <TabPanel>
    {
      accounts?.length > 0 ?
        accounts?.map((account, index) => <Account key={`personal-=account-${account.email}-${index}`} account={account} onDeletePress={onDeletePress} onEditPress={onEditPress} />) :
        <Text>No accounts found. Do note that these accounts are stored in localStorage.</Text>
    }
  </TabPanel>;
}

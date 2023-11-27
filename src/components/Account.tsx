import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Progress, Text, useToast } from "@chakra-ui/react";
import * as OTPAuth from "otpauth";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentSeconds, truncateTo } from "../lib/Helper";
import { useCopyToClipboard } from "../lib/useCopyToClipboard";

type Props = {
  account: AccountWithId;
  onDeletePress: (account: AccountWithId) => void;
  onEditPress: (account: AccountWithId) => void;
}

const PERIOD = 30;

export const Account: FC<Props> = ({ account, onDeletePress, onEditPress }) => {
  const toast = useToast();
  const [, copy] = useCopyToClipboard();
  const { email, secret, tag } = account;
  const [updatingIn, setUpdatingIn] = useState(30);
  const [token, setToken] = useState("");

  const totp = useMemo(() => new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  }), [secret]);

  const update = useCallback(() => {
    const countdown = PERIOD - (getCurrentSeconds() % PERIOD);
    setUpdatingIn(countdown);
    setToken(truncateTo(totp.generate(), 6));
  }, [totp]);

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalHandle = setInterval(update, 1000);
    return () => clearInterval(intervalHandle);
  }, [update]);

  const onCopyPress = () => {
    copy(token);
    toast({
      title: `Success! (${email})`,
      description: "Code copied to clipboard.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const onDeleteClick = () => {
    onDeletePress(account)
  }

  const onEditClick = () => {
    onEditPress(account)
  }

  const renderTag = () => {
    if (!tag || !Array.isArray(tag) || (Array.isArray(tag) && tag.length < 1)) {
      return null
    }

    return <Flex flexDir="row">{
      tag.map(tag => <Badge ml='1' backgroundColor="transparent" colorScheme="blue">{tag}</Badge>)
    }</Flex>
  }

  return <Box marginBottom={2}>
    <Flex flexDir="row">
      <Flex flex="1" flexDir="row" justifyContent={"space-between"} paddingRight={2} alignItems="center">
        <Text>{email}</Text>
        {renderTag()}
      </Flex>
      <Flex alignItems="center">
        <Text>{token}</Text>
        <CopyIcon marginLeft={2} _hover={{ cursor: "pointer" }} onClick={onCopyPress} />
        <EditIcon marginLeft={2} _hover={{ cursor: "pointer" }} onClick={onEditClick} />
        <DeleteIcon marginLeft={2} onClick={onDeleteClick} _hover={{ cursor: "pointer" }} />
      </Flex>
    </Flex>
    <Progress value={updatingIn / (PERIOD * 1.0) * 100} size='xs' colorScheme='pink' />
  </Box>
}

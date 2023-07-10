import { CopyIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, Progress, Text, useToast } from "@chakra-ui/react";
import * as OTPAuth from "otpauth";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentSeconds, truncateTo } from "../lib/Helper";
import { useCopyToClipboard } from "../lib/useCopyToClipboard";

type Props = {
  account: Account;
  onDeletePress: (email: string) => void;
}

const PERIOD = 30;

export const Account: FC<Props> = ({ account, onDeletePress }) => {
  const toast = useToast();
  const [value, copy] = useCopyToClipboard();
  const { email, secret } = account;
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


  return <Box marginBottom={2}>
    <Flex flexDir="row" justifyContent="space-between" >
      <Text>{email}</Text>
      <Flex alignItems="center">
        <Text>{token}</Text>
        <CopyIcon marginLeft={2} _hover={{ cursor: "pointer" }} onClick={onCopyPress} />
        <EditIcon marginLeft={2} _hover={{ cursor: "pointer" }} />
        <DeleteIcon marginLeft={2} onClick={() => onDeletePress(email)} _hover={{ cursor: "pointer" }} />
      </Flex>
    </Flex>
    <Progress value={updatingIn / (PERIOD * 1.0) * 100} size='xs' colorScheme='pink' />
  </Box>
}

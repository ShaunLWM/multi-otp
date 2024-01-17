import { AddIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  onClick: () => void;
}

export const AddFab: FC<Props> = ({ onClick }) => {
  return <Box _hover={{ cursor: "pointer" }} onClick={onClick} borderRadius={100} position="absolute" right={20} bottom={20} height={50} width={50} backgroundColor="gray.500" display="flex" justifyContent="center" alignItems="center">
    <AddIcon />
  </Box>
}

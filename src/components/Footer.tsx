import { Container, Text } from "@chakra-ui/react"

export const Footer = () => {
  return <Container position="absolute" bottom="0" alignSelf="center" textAlign="center">
    <Text fontSize="10">Made with hatred 😒 - Shaun {new Date().getFullYear()}</Text>
  </Container>
}

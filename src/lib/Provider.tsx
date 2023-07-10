import { ChakraProvider } from '@chakra-ui/react'
import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

type Props = {
  children: JSX.Element
}

const queryClient = new QueryClient()

export const Provider: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}

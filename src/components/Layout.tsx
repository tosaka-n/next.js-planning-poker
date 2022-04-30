import { Divider, HStack } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Header } from "src/components/Header"
import { Sidebar } from "src/components/Sidebar"

export const Layout = ({ isOpen, onClose, onOpen, children }: { isOpen: boolean, onClose: () => void, onOpen: () => void, children: ReactNode }) => {
  return (
    <>
      <Header isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <HStack
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
        spacing={0}
      >
        <Sidebar />
        <Divider h={'calc(100vh - 3rem)'} orientation='vertical' variant={'solid'} borderColor='black' />
        {children}
      </HStack>
    </>
  )
}
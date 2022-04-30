import { Button, Container, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Layout } from "src/components/Layout";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
  <Layout isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
    <Container>
      <div>
        Some Text
      </div>
      <Button onClick={onOpen}>Open Modal</Button>
    </Container>
  </Layout>
)}
export default Home;
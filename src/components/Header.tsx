import { Box, Heading, HStack, Image, Spacer } from "@chakra-ui/react";
import { SomeModal } from "./Modal";

export const Header = ({ isOpen, onClose, onOpen }: { isOpen: boolean, onClose: () => void, onOpen: () => void }) => (
  <Box
    position={'sticky'}
    top={0}
    zIndex={2}
    maxW={'100vw'}
    bgColor={'white'}
    fontSize={"2rem"}
    h={'3rem'}
    borderBottom={'solid 5px'}
    borderColor={'red'}
  >
    <HStack spacing={0}>
      <Box
        pl={'1rem'}
      >
        {'HEAD TITLE'}
      </Box>
      <Spacer/>
      <Box pr={'1rem'} onClick={onOpen}>
        <Image h={'2rem'} src='https://xsgames.co/randomusers/avatar.php?g=male' />
      </Box>
      <SomeModal isOpen={isOpen} onClose={onClose} />
    </HStack>
  </Box>
)
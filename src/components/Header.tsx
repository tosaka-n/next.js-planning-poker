import { Box, HStack, Image, Spacer } from "@chakra-ui/react";

export const Header = () => (
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
      <Box pr={'1rem'}>
        <Image h={'2rem'} src='https://xsgames.co/randomusers/avatar.php?g=male' />
      </Box>
    </HStack>
  </Box>
)
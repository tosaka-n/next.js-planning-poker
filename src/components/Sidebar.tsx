import {
  Stack, Button, Text, Box, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image
} from "@chakra-ui/react";
const Members = [
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
  { id: 1, name: 'TEST USER 1', link: '/TEST_USER_1' },
]

const SidebarRow = () => (
  <Box borderBottom={'1px solid'} borderColor={'red'}>
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton
            fontSize={'xs'}
            w={'8rem'}>
            <Box
              flex='1'
              textAlign='left'>
              Members
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        {
          Members.map(member =>
            <AccordionPanel
              pb={4}
              bgColor={'transparent'}
              _hover={{ bgColor: 'transparent' }}
              as={Button}
              onClick={() => {
                alert(`link to ${member.link}`)
              }}>
              <Image h={'2rem'} src='https://xsgames.co/randomusers/avatar.php?g=male' />
              {member.name}
            </AccordionPanel>
          )
        }
      </AccordionItem>
    </Accordion>
  </Box>
)

export const Sidebar = () => (
  <Stack
    position={'sticky'}
    mt={0}
    minH={'calc(100vh - 3rem)'}
    top={'3rem'}
    bottom={0}
    zIndex={1}
    w={'8rem'}
    alignItems={'center'}
  >
    <SidebarRow />
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
    <Button w={'5rem'} size={'xs'} as={Text}>COLUMNS</Button>
  </Stack>
)
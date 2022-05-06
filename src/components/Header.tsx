import { Box, HStack, Image, Link, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();

  return (
    <Box
      position={"sticky"}
      top={0}
      zIndex={2}
      bgColor={"white"}
      fontSize={"2rem"}
      h={"3rem"}
      w={"100vw"}
      borderBottom={"solid 5px"}
      borderColor={"red"}
    >
      <HStack spacing={0}>
        <Box
          pl={"1rem"}
          as={Link}
          onClick={() => router.push("/")}
          style={{ textDecoration: "none" }}
        >
          {"HEAD TITLE"}
        </Box>
        <Spacer />
      </HStack>
    </Box>
  );
};

import { usePrefersReducedMotion, Box, Button, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const spin = keyframes`
from { transform: rotate3d(0, 1, 0, 0); }
to { transform: rotate3d(0, 1, 0, 360deg); }
`;
const Card = ({
  value,
  isClickable = false,
  isSelected = false,
  isOpen = true,
  handleCardClick,
}: {
  value: string | null;
  isClickable: boolean;
  isSelected: boolean;
  isOpen?: boolean;
  handleCardClick?: (vote: string | null) => void;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion ? undefined : `${spin} 0.5s linear`;
  const handleOnClck = (vote: string | null) => {
    if (!isClickable || !handleCardClick) {
      return;
    }
    isSelected ? handleCardClick(null) : handleCardClick(vote);
  };
  return (
    <Box
      border={"3px solid"}
      borderRadius={"1rem"}
      h={{ base: "6rem", md: "10rem" }}
      w={{ base: "4rem", md: "6.5rem" }}
      alignItems={"center"}
      alignContent={"center"}
      fontSize={{ base: "xxs", md: "xx-large" }}
      fontWeight={"bold"}
      textColor={isSelected ? "white" : "black"}
      justifyContent={"center"}
      as={Button}
      isDisabled={!isClickable}
      transition={"transition: all 0.4s ease s;"}
      _focus={{ boxShadow: "none" }}
      _hover={{
        textColor: "white",
        bgColor: isSelected ? "red.700" : "red.600",
      }}
      onClick={() => handleOnClck(value)}
      bgColor={isSelected ? "red.600" : "white"}
      animation={isSelected ? animation : ""}
    >
      {isOpen ? (
        <Text textAlign={"center"} whiteSpace={"pre"}>
          {value}
        </Text>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Card;

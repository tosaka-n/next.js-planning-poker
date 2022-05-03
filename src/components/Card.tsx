import {
  usePrefersReducedMotion,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const spin = keyframes`
from { transform: rotate3d(0, 1, 0, 0); }
to { transform: rotate3d(0, 1, 0, 360deg); }
`;
const Card = ({
  index,
  value,
  isClickable = false,
  isSelected = false,
  isOpen = true,
  handleCardClick,
}: {
  index: string;
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
      key={`${index}`}
      border={"3px solid"}
      borderRadius={"1rem"}
      w={"6.5rem"}
      h={"10rem"}
      alignItems={"center"}
      alignContent={"center"}
      fontSize={"xx-large"}
      fontWeight={"bold"}
      textColor={isSelected ? "white" : "black"}
      justifyContent={"center"}
      as={Button}
      isDisabled={!isClickable}
      transition={"transition: all 0.4s ease s;"}
      _focus={{ boxShadow: "none" }}
      _hover={{
        textColor: "gray",
        bgColor: isSelected ? "black" : "transparent",
      }}
      onClick={() => handleOnClck(value)}
      bgColor={isSelected ? "black" : "white"}
      animation={isSelected ? animation : ""}
    >
      {isOpen ? (
        <Text key={`card_${index}`} textAlign={"center"}>
          {value}
        </Text>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Card;

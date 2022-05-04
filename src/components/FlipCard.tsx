import { usePrefersReducedMotion, Box, Button, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import cardBg from "src/images/alchemymod.png";
import Card from "./Card";
const spin1 = keyframes`
from { transform: rotateY(0deg); }
to { transform: rotateY(180deg); }
`;
const spin2 = keyframes`
from { transform: rotateY(-180deg); }
to { transform: rotateY(0deg); }
`;

const FlipCard = ({
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
  const animation1 = prefersReducedMotion
    ? undefined
    : `${spin1} 0.5s linear; trainsiton: { opacity: 0 };`;
  const animation2 = prefersReducedMotion ? undefined : `${spin2} 0.5s linear`;
  const handleOnClck = (vote: string | null) => {
    if (!isClickable || !handleCardClick) {
      return;
    }
    isSelected ? handleCardClick(null) : handleCardClick(vote);
  };
  return value === null ? (
    <Card
      isClickable={false}
      isSelected={false}
      isOpen={true}
      value={"NOT\nYET"}
      index={""}
      handleCardClick={() => {}}
    />
  ) : (
    <Box h={"10rem"} w={"6.5rem"}>
      <Box
        position={"relative"}
        key={`${index}`}
        border={"3px solid"}
        borderRadius={"1rem"}
        w={"6.5rem"}
        h={"10rem"}
        alignItems={"center"}
        alignContent={"center"}
        fontSize={"xx-large"}
        fontWeight={"bold"}
        justifyContent={"center"}
        as={Button}
        _focus={{ boxShadow: "none" }}
        _hover={{
          textColor: "gray",
          bgColor: "black",
        }}
        onClick={() => handleOnClck(value)}
        bgColor={"black"}
        bgImage={cardBg.src}
        backgroundSize={"6rem 6rem"}
        backgroundRepeat={"no-repeat"}
        backgroundPosition={"center"}
        animation={isOpen ? animation1 : animation2}
        style={{ backfaceVisibility: "hidden" }}
        opacity={isOpen ? 0 : 1}
      />
      <Box
        position={"relative"}
        key={`${index}`}
        border={"3px solid"}
        borderRadius={"1rem"}
        w={"6.5rem"}
        h={"10rem"}
        alignItems={"center"}
        alignContent={"center"}
        fontSize={"xx-large"}
        fontWeight={"bold"}
        textColor={"black"}
        justifyContent={"center"}
        as={Button}
        _focus={{ boxShadow: "none" }}
        onClick={() => handleOnClck(value)}
        bgColor={"white"}
        animation={isOpen ? animation2 : animation1}
        style={{ backfaceVisibility: "hidden" }}
        top={"-10rem"}
        opacity={isOpen ? 1 : 0}
      >
        <Text key={`card_${index}`} textAlign={"center"} whiteSpace={"pre"}>
          {value}
        </Text>
      </Box>
    </Box>
  );
};

export default FlipCard;

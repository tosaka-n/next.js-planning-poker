import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Layout } from "src/components/Layout";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { RoomDetails } from "src/server";
import Card from "src/components/Card";
import FlipCard from "src/components/FlipCard";

const Room = () => {
  const [socket, _] = useState(() => io());
  const [messageLogs, setMessageLogs] = useState<
    { message: string; userId: string }[]
  >([]);
  const [vote, setVote] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [roomInfo, setRoomInfo] = useState<RoomDetails["roomInfo"]>();
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (!roomId) {
      return;
    }
    socket.on("connect", () => {
      console.log("join");
      socket.emit("join", { roomId });
    });
    socket.on("roomInfo", (data: RoomDetails) => {
      console.log("Recieve: roomInfo");
      console.log({ ...data.roomInfo });
      setConnected(true);
      if (!data) {
        return;
      }
      if (data.log?.length === 0) {
        setMessageLogs((_) => []);
        return;
      }
      if (messageLogs.length === 0) {
        setRoomInfo(data.roomInfo);
      }
    });
    socket.on("message", (data: { message: string; userId: string }) => {
      setMessageLogs((prev) => [...prev, data]);
    });
    socket.on("open", () => {
      setOpen(true);
    });
    socket.on("reset", () => {
      setOpen(false);
      setVote(null);
    });
    socket.emit("logs", { roomId });
    setInterval(() => socket.emit("logs", { roomId }), 2.5 * 1000);
  }, [roomId, isOpen]);
  const handleVote = (value: string | null) => {
    setVote(value);
    socket.emit("vote", { roomId, vote: value });
  };
  const handleOpen = () => {
    setOpen(true);
    socket.emit("open", { roomId });
  };
  const handleReset = () => {
    if (isOpen) {
      setOpen(false);
      setVote(null);
    }
    socket.emit("reset", { roomId });
  };
  return (
    <Layout>
      {connected ? (
        <Box>
          <Heading>
            Room: {roomId} / UserId: {socket.id}
          </Heading>
          <Button
            isDisabled={
              isOpen ||
              (!isOpen &&
                !roomInfo?.member.every((member) => member.vote != null))
            }
            onClick={() => handleOpen()}
          >
            Open Vote
          </Button>
          <Button isDisabled={!isOpen} onClick={() => handleReset()}>
            Reset Vote
          </Button>
          <Flex
            justifyItems={"center"}
            border={"3px solid"}
            borderColor={"black"}
            bgColor={"whatsapp.200"}
            w={{base: 'fit-content', sm: "100vw"}}
            mx={"auto"}
          >
            <HStack
              my={"2rem"}
              mx={"auto"}
              display={{ base: "none", lg: "flex" }}
            >
              {["0", "1/2", "1", "3", "5", "8", "13", "20", "?"].map(
                (value, index) => (
                  <Card
                    index={`card_${index}`}
                    value={value}
                    isClickable={!isOpen}
                    isSelected={vote === value}
                    handleCardClick={(vote) => handleVote(vote)}
                  />
                )
              )}
            </HStack>
            <Stack
              align="stretch"
              my={"1rem"}
              mx={"auto"}
              display={{ base: "flex", lg: "none" }}
            >
              {[
                ["0", "1/2", "1", "3"],
                ["5", "8", "13", "20", "?"],
              ].map((arr) => (
                <HStack mx={"auto"} spacing={{ base: "1rem", md: "2rem" }}>
                  {arr.map((value, index) => (
                    <Card
                      index={`card_${index}`}
                      value={value}
                      isClickable={!isOpen}
                      isSelected={vote === value}
                      handleCardClick={(vote) => handleVote(vote)}
                    />
                  ))}
                </HStack>
              ))}
            </Stack>
          </Flex>
          <VStack justifyItems={"center"}>
            <Box display={isOpen ? "block" : "none"}>
              Avarage{" "}
              {(roomInfo?.member
                .map((v) => (v.vote === "1/2" ? 0.5 : Number(v.vote) || 0))
                .reduce((prev, cur) => prev + cur) || 1) /
                (roomInfo?.member.length || 1)}
            </Box>
            <HStack spacing={"2rem"} m={"auto"} mt={{base: "1rem", md: "2rem"}}>
              {roomInfo?.member.map((member, index) => (
                <FlipCard
                  index={`result_${index}`}
                  value={member.vote}
                  isClickable={false}
                  isSelected={member.vote !== null}
                  isOpen={isOpen}
                  handleCardClick={() => {}}
                />
              ))}
            </HStack>
          </VStack>
        </Box>
      ) : (
        <Container>
          <Center>
            <Spinner />
          </Center>
        </Container>
      )}
    </Layout>
  );
};

export default Room;

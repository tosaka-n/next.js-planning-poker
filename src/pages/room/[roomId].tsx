import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Layout } from "src/components/Layout";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { NextRequest } from "next/server";

const Room = () => {
  const [socket, _] = useState(() => io());
  const [messageLogs, setMessageLogs] = useState<
    { message: string; userId: string }[]
  >([]);
  const [messageValue, setSendMessages] = useState<string>("");
  const [userId, setUserId] = useState<string>();
  const [connected, setConnected] = useState<boolean>(false);
  const [messageLength, setShowMessageLength] = useState<number>(5);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    let savedUserId = localStorage.getItem("userId");
    if (!savedUserId) {
      savedUserId = nanoid(5);
      localStorage.setItem("userId", savedUserId);
    }
    setUserId(savedUserId);
    if (!roomId) {
      return;
    }
    socket.on("roomInfo", (data: { message: string; userId: string }[]) => {
      if (!data) {
        return;
      }
      if (data?.length === 0) {
        setMessageLogs((_) => []);
      }
      if (messageLogs.length === 0) {
        setMessageLogs((prev) => [...prev, ...data]);
      }
    });
    socket.on("connect", () => {
      console.log("join");
      setConnected(true);
      socket.emit("join", { roomId, userId: savedUserId });
    });
    socket.on("message", (data: { message: string; userId: string }) => {
      setMessageLogs((prev) => [...prev, data]);
    });
    if (messageLogs.length === 0) {
      socket.emit("logs", { roomId });
    }
  }, [roomId]);
  const sendMessage = (event?: React.MouseEvent<HTMLButtonElement>): void => {
    if (messageValue.length === 0) {
      return;
    }
    socket.emit("message", { message: messageValue, roomId, userId });
    setSendMessages("");
  };
  const clearAllMessage = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    socket.emit("clearAll", { roomId, userId });
    setMessageLogs([]);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget?.value.length === 0) {
      return;
    }
    setSendMessages(event.currentTarget?.value);
  };
  const handleReadMore = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setShowMessageLength(messageLength + 5);
  };
  const handleReadLess = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setShowMessageLength(messageLength - 5);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      sendMessage();
    } else {
      return;
    }
  };
  return (
    <Layout>
      {connected ? (
        <Container>
          <Heading>Room: {roomId}</Heading>
          <Input
            value={messageValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          ></Input>
          <Button onClick={sendMessage}>Send</Button>
          <Button onClick={clearAllMessage}>Clear All</Button>
          <Box>
            {messageLogs
              .slice(-messageLength)
              .reverse()
              .map((msgs, index) => (
                <Text key={index}>
                  {msgs.userId}: {msgs.message}
                </Text>
              ))}
          </Box>
          <Button
            disabled={messageLength > messageLogs.length}
            onClick={handleReadMore}
          >
            Read More
          </Button>
          <Button disabled={messageLength <= 5} onClick={handleReadLess}>
            Less
          </Button>
        </Container>
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

import { Box, Button, Container, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Layout } from "src/components/Layout";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const Home = () => {
  const [socket, _] = useState(() => io());
  const [messageLogs, setMessageLogs] = useState<
    { message: string; userId: string }[]
  >([]);
  const [messageValue, setSendMessages] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [messageLength, setShowMessageLength] = useState<number>(5);
  const roomId = 100;

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
      if (data.length === 0) {
        setMessageLogs([]);
      }
      setMessageLogs((prev) => [...prev, ...data]);
    });
    socket.on("connect", () => {
      console.log("join");
      socket.emit("join", { roomId, userId: savedUserId });
    });
    socket.on("message", (data: { message: string; userId: string }) => {
      setMessageLogs((prev) => [...prev, data]);
    });
  }, [roomId]);
  const sendMessage = (event: React.MouseEvent<HTMLButtonElement>): void => {
    socket.emit("message", { message: messageValue, roomId, userId });
    setSendMessages("");
  };
  const clearAllMessage = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    socket.emit("clearAll", { roomId });
    setMessageLogs([]);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendMessages(event.currentTarget.value);
  };
  const handleReadMore = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setShowMessageLength(messageLength + 5)
  }
  const handleReadLess = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setShowMessageLength(messageLength - 5)
  }

  return (
    <Layout>
      <Container>
        <Input value={messageValue} onChange={handleChange}></Input>
        <Button onClick={sendMessage}>Send</Button>
        <Button onClick={clearAllMessage}>Clear All</Button>
        <Box>
          {messageLogs
            .slice(-messageLength)
            .reverse()
            .map((msgs, index) => (
              <Text key={index}>{msgs.userId}: {msgs.message}</Text>
            ))}
        </Box>
        <Button disabled={messageLength > messageLogs.length} onClick={handleReadMore}>Read More</Button>
        <Button disabled={messageLength <= 5} onClick={handleReadLess}>Less</Button>
      </Container>
    </Layout>
  );
};
export default Home;

import { Box, Button, Container, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Layout } from "src/components/Layout";
import io from "socket.io-client";

const Home = () => {
  const [socket, _] = useState(() => io());
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setSendMessages] = useState<string>();
  const roomId = 100;

  useEffect(() => {
    if (!roomId) {
      return;
    }
    socket.on("connect", () => {
      console.log("join");
      socket.emit("join", roomId);
    });
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, { message: data.message }]);
      console.log(data);
    });
  }, [roomId]);
  const sendMessage = (event: React.MouseEvent<HTMLButtonElement>): void => {
    socket.emit("message", { message: message, roomId });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendMessages(event.currentTarget.value);
  };
  return (
    <Layout>
      <Container>
        <Box>
          {messages.map((v) => v.message).join("\n")}
          {messages.map((msgs, index) => (
            <Text key={index}>{msgs.message}</Text>
          ))}
        </Box>
        <Input onChange={handleChange}></Input>
        <Button onClick={sendMessage}>Send</Button>
      </Container>
    </Layout>
  );
};
export default Home;

import {
  Input,
  Text,
  Stack,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { Router, useRouter } from "next/router";
import React, { useState } from "react";
import { Layout } from "src/components/Layout";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length === 0) {
      return;
    }
    setRoomId(event.currentTarget.value);
  };
  const handleSumbit = (
    event: React.FormEvent<HTMLButtonElement | HTMLDivElement>,
    type: "create" | "join"
  ) => {
    event.preventDefault();
    if (type === "create") {
      router.push(`/room/${nanoid(5)}`);
    } else {
      console.log(event);
      if (roomId.length === 0) {
        return;
      }
      router.replace(`/room/${roomId}`);
    }
  };
  return (
    <Layout>
      <Stack>
        <Button onClick={(e) => handleSumbit(e, "create")}>
          Create New Room
        </Button>
        <FormLabel>RoomId</FormLabel>
        <Input placeholder="input room id" onChange={handleInput}></Input>
        <Button type={"submit"} onClick={(e) => handleSumbit(e, "join")}>
          Join
        </Button>
      </Stack>
    </Layout>
  );
}

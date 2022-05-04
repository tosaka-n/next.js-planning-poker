import {
  Input,
  VStack,
  Button,
  FormLabel,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FlipCard from "src/components/FlipCard";
import { Layout } from "src/components/Layout";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [isOpen, setOpen] = useState<boolean>(false);
  setTimeout(() => setOpen(!isOpen), 2000);
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
      <VStack spacing={"2rem"} mt={"2rem"}>
        <Button
          size={"md"}
          w={"15rem"}
          onClick={(e) => handleSumbit(e, "create")}
        >
          Create New Room
        </Button>
        <FormLabel>RoomId</FormLabel>
        <Input
          w={"15rem"}
          placeholder="input room id"
          onChange={handleInput}
        ></Input>
        <Button
          size={"md"}
          w={"5rem"}
          type={"submit"}
          onClick={(e) => handleSumbit(e, "join")}
        >
          Join
        </Button>
        <Flex justifyItems={"center"}>
          <HStack spacing={"2rem"} m={"auto"} mt={"2rem"}>
            <FlipCard
              isClickable={true}
              isOpen={isOpen}
              isSelected={false}
              index={""}
              handleCardClick={() => {}}
              value={"GROW\nYOUR\nTEAM."}
            />
          </HStack>
        </Flex>
      </VStack>
    </Layout>
  );
}

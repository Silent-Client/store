import { Center, Image, Stack, Text, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../hooks/auth";

export type StoreItemType = {
  id: number;
  texture: string;
  name: string;
  price: number;
  sale_price: number;
  normal_price: number;
  category: string;
  preview: string;
  created_at: string;
  updated_at: string;
};

function StoreItem({
  data,
  type,
  pageType = "store",
}: {
  data: StoreItemType;
  type: "capes" | "wings";
  pageType?: "account" | "store";
}) {
  const navigate = useNavigate();

  const toast = useToast();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const buyItem = async () => {
    if (!getUser()) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    try {
      const { data: res } = await axios.post(
        "https://api.silentclient.ml/store/buy_cosmetics",
        {
          id: data.id,
          type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${getUser()?.accessToken}`,
          },
        }
      );

      if (res.errors) {
        for (const error of res.errors) {
          toast({
            title: "Error!",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        return;
      }

      window.location.href = res.payUrl;
    } catch (err: any) {
      if (err?.response && err.response?.data && err.response.data?.errors) {
        for (const error of err.response.data.errors) {
          toast({
            title: "Error!",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Stack
      direction="column"
      overflow="hidden"
      border="3px solid"
      borderColor={"#2c2c2c"}
      boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
      bgColor="#1f1f1f"
      userSelect="none"
    >
      <Center
        w="full"
        h="250px"
        padding="10px"
        bgImage={
          "radial-gradient( rgba(255,255,255,0.15), rgba(20,20,20,0.1) )"
        }
      >
        <Image
          w="230px"
          h="230px"
          draggable="false"
          loading="lazy"
          src={`https://api.silentclient.ml${data.preview}`}
        />
      </Center>
      <Stack
        bgColor="#3a3a3a"
        padding="10px"
        direction={["column", "row"]}
        spacing={["5px", "0px"]}
        justifyContent={"space-between"}
      >
        <Stack direction="column" spacing="0px">
          <Text fontSize={16} fontWeight={600} color="white">
            {data.name}
          </Text>
          {pageType === "store" && <Text fontSize={16}>{data.price}₽</Text>}
        </Stack>
        {pageType === "store" && (
          <Button w={["full", "auto"]} isDisabled={isLoading} onClick={buyItem}>
            Buy
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

export default StoreItem;

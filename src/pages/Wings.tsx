import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import StoreItem, { StoreItemType } from "../components/StoreItem";

function Wings() {
  const [wings, setWings] = React.useState<StoreItemType[] | null>(null);

  const toast = useToast();

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data: wings } = await axios.get(
          "https://api.silentclient.net/store/wings"
        );

        setWings(wings.wings);
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
      }
    };

    getData();
    // eslint-disable-next-line
  }, []);
  return (
    <Box>
      <Title title="Wings | Silent Client Store" />
      <Center>
        <Heading>Wings</Heading>
      </Center>
      {(wings === null && (
        <Center mt={5} w="full">
          <Spinner size="xl" />
        </Center>
      )) || (
        <SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
          {wings?.map((wing) => (
            <StoreItem type="wings" data={wing} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default Wings;

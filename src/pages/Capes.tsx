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

function Capes() {
  const [capes, setCapes] = React.useState<StoreItemType[] | null>(null);

  const toast = useToast();

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data: capes } = await axios.get(
          "https://api.silentclient.ml/store/capes"
        );

        setCapes(capes.capes);
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
      <Title title="Capes | Silent Client Store" />
      <Center>
        <Heading>Capes</Heading>
      </Center>
      {(capes === null && (
        <Center mt={5} w="full">
          <Spinner size="xl" />
        </Center>
      )) || (
        <SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
          {capes?.map((cape) => (
            <StoreItem type="capes" data={cape} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default Capes;

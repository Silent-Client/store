import {
  Box,
  Button,
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
import { Link as RLink } from "react-router-dom";

function Main() {
  const [capes, setCapes] = React.useState<StoreItemType[] | null>(null);
  const [wings, setWings] = React.useState<StoreItemType[] | null>(null);

  const toast = useToast();

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data: capes } = await axios.get(
          "https://api.silentclient.net/store/capes"
        );

        const capesArr = capes.capes;

        if (capesArr.length > 3) {
          capesArr.length = 3;
        }

        setCapes(capesArr);

        const { data: wings } = await axios.get(
          "https://api.silentclient.net/store/wings"
        );

        const wingsArr = wings.wings;

        if (wingsArr.length > 3) {
          wingsArr.length = 3;
        }

        setWings(wingsArr);
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
      <Title title="Silent Client Store" />
      <Center>
        <Heading>Capes</Heading>
      </Center>
      {(capes === null && (
        <Center mt={5} w="full">
          <Spinner size="xl" />
        </Center>
      )) || (
        <>
          <SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
            {capes?.map((cape) => (
              <StoreItem type="capes" data={cape} />
            ))}
          </SimpleGrid>
          {capes && capes?.length > 2 && (
            <Center w="full" mt={5}>
              <RLink to="/capes">
                <Button>Show more</Button>
              </RLink>
            </Center>
          )}
        </>
      )}
      <Center mt={10}>
        <Heading>Wings</Heading>
      </Center>
      {(wings === null && (
        <Center mt={5} w="full">
          <Spinner size="xl" />
        </Center>
      )) || (
        <>
          <SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
            {wings?.map((wing) => (
              <StoreItem type="wings" data={wing} />
            ))}
          </SimpleGrid>
          {wings && wings?.length > 2 && (
            <Center w="full" mt={5}>
              <RLink to="/wings">
                <Button>Show more</Button>
              </RLink>
            </Center>
          )}
        </>
      )}
    </Box>
  );
}

export default Main;

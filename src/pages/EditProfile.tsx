import React from "react";
import { getUser } from "../hooks/auth";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import parse from "html-react-parser";
import {
  Center,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export type EditProfileType = {
  username?: string;
  email?: string;
  password?: string;
};

function EditProfile() {
  const user = getUser();
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileType>();
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const { data: res } = await axios.post(
        "https://api.silentclient.net/account/edit_profile",
        data,
        {
          headers: {
            authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (res.errors) {
        for (const err of res.errors) {
          if (err.message === "Username already taken") {
            toast({
              title: "Username already taken",
              description: parse(
                "<a href='/#/free_username' style='text-decoration: underline;'>Free username</a>"
              ),
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Error!",
              description: err.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
        return;
      }

      window.location.reload();
    } catch (err: any) {
      if (err?.response && err.response?.data && err.response.data?.errors) {
        for (const error of err.response.data.errors) {
          if (error.message === "Username already taken") {
            toast({
              title: "Username already taken",
              description: parse(
                "<a href='/#/free_username' style='text-decoration: underline;'>Free username</a>"
              ),
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
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
    } finally {
      setIsLoading(false);
    }
  });
  return (
    <Center w="full" h="full">
      <Title title="Edit profile | Silent Client" />

      <form onSubmit={onSubmit}>
        <Stack direction="column" spacing="10px">
          <Center>
            <Heading>Edit profile</Heading>
          </Center>
          <FormControl isInvalid={errors.username ? true : false}>
            <FormLabel>Minecraft username</FormLabel>
            <Input
              isDisabled={isLoading}
              defaultValue={user?.original_username}
              type="text"
              {...register("username", { required: false })}
            />
            {errors.username && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.email ? true : false}>
            <FormLabel>New email</FormLabel>
            <Input
              isDisabled={isLoading}
              type="email"
              {...register("email", { required: false })}
            />
            {errors.email && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.password ? true : false}>
            <FormLabel>New password</FormLabel>
            <Input
              isDisabled={isLoading}
              type="password"
              {...register("password", { required: false })}
            />
            {errors.password && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <Button w="full" type="submit" isDisabled={isLoading}>
            Update profile
          </Button>
        </Stack>
      </form>
    </Center>
  );
}

export default EditProfile;

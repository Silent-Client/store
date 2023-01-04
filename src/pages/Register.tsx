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
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { register as RegisterHook } from "../hooks/auth";
import parse from "html-react-parser";

export type RegisterType = {
	username: string;
	email: string;
	password: string;
};

function Register() {
	const toast = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterType>();
	const onSubmit = handleSubmit(async data => {
		setIsLoading(true);
		try {
			const res = await RegisterHook(data.username, data.email, data.password);

			if (res.errors) {
				for (const err of res.errors) {
					if (err.message === "Username already taken") {
						toast({
							title: "Username already taken",
							description: parse(
								"<a href='/free_username' style='text-decoration: underline;'>Free username</a>"
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

			window.location.href = "/";
		} catch (error: any) {
			toast({
				title: "Error!",
				description: error?.message || `${error}`,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<Center w="full" h="full">
			<Title title="Register | Silent Client" />

			<form onSubmit={onSubmit}>
				<Stack direction="column" spacing="10px">
					<Center>
						<Heading>Register to Silent Client</Heading>
					</Center>
					<FormControl isInvalid={errors.username ? true : false}>
						<FormLabel>Minecraft username</FormLabel>
						<Input
							isDisabled={isLoading}
							type="text"
							{...register("username", { required: true })}
						/>
						{errors.username && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={errors.email ? true : false}>
						<FormLabel>Email</FormLabel>
						<Input
							isDisabled={isLoading}
							type="text"
							{...register("email", { required: true })}
						/>
						{errors.email && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={errors.password ? true : false}>
						<FormLabel>Password</FormLabel>
						<Input
							isDisabled={isLoading}
							type="password"
							{...register("password", { required: true })}
						/>
						{errors.password && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<Button w="full" type="submit" isDisabled={isLoading}>
						Register
					</Button>
				</Stack>
			</form>
		</Center>
	);
}

export default Register;

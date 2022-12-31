import React from "react";
import axios from "axios";
import { Title } from "react-head-meta";
import { useSearchParams, Link as RLink } from "react-router-dom";
import {
	Box,
	Button,
	Center,
	Heading,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { getUser } from "../hooks/auth";

function FreeUsername() {
	let [searchParams] = useSearchParams();

	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [errors, setErrors] = React.useState<string[]>([]);

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			setErrors([]);
			try {
				if (!searchParams.get("code")) {
					return;
				}

				const { data: res } = await axios.post(
					"https://api.silentclient.net/free_username",
					{
						code: searchParams.get("code"),
					}
				);

				if (!res.errors) {
					setErrors([]);
				}
			} catch (err: any) {
				if (err?.response && err.response?.data && err.response.data?.errors) {
					for (const error of err.response.data.errors) {
						setErrors([...errors, error.message]);
					}
				}
			} finally {
				setIsLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	return searchParams.get("code") ? (
		isLoading ? (
			<Center w="full" h="70vh">
				<Spinner size="xl" />
			</Center>
		) : (
			<Box>
				<Title title="Free Username | Silent Client Store" />
				{(errors.length !== 0 && (
					<Stack direction="column" spacing={5}>
						<Center w="full">
							<Heading textAlign={"center"}>Errors</Heading>
						</Center>
						{errors.map(err => (
							<Text>{err}</Text>
						))}
					</Stack>
				)) || (
					<Stack direction="column" spacing={5}>
						<Center w="full">
							<Heading textAlign={"center"}>Success!</Heading>
						</Center>
						<Text fontSize="xl">
							The username has been successfully freed for you!
							<br /> Go to the{" "}
							{getUser()?.original_username
								? "edit profile"
								: "registration"}{" "}
							page and use this username.
						</Text>
						<Button
							w="auto"
							as={RLink}
							to={getUser()?.original_username ? "/edit_account" : "register"}
						>
							Go to{" "}
							{getUser()?.original_username ? "edit profile" : "registration"}{" "}
							page
						</Button>
					</Stack>
				)}
			</Box>
		)
	) : (
		<Box w="full">
			<Title title="Free Username | Silent Client Store" />
			<Center w="full">
				<Heading textAlign={"center"}>Freeing a taken username</Heading>
			</Center>
			<Text mt={5}>
				To free a taken username, you need to login through a Microsoft account,
				where a Minecraft account with a taken username will be available.
			</Text>
			<Button
				mt={5}
				colorScheme={"green"}
				onClick={() =>
					(window.location.href =
						"https://login.live.com/oauth20_authorize.srf?client_id=b134f19c-06ef-418c-b87d-a58073f65a64&response_type=code&redirect_uri=https://auth.silentclient.net/free_username&scope=XboxLive.signin%20offline_access&state=NOT_NEEDED")
				}
			>
				Login to Microsoft
			</Button>
		</Box>
	);
}

export default FreeUsername;

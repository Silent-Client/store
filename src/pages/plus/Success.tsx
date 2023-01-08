import {
	Container,
	Center,
	Heading,
	Stack,
	Text,
	Button,
	Spinner,
} from "@chakra-ui/react";
import { Title } from "react-head-meta";
import React from "react";
import { useSearchParams, Link as RLink } from "react-router-dom";
import NotFound from "../NotFound";
import { getUser } from "../../hooks/auth";
import axios from "axios";

function Success() {
	let [searchParams] = useSearchParams();

	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [notFound, setNotFound] = React.useState<boolean>(false);

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				if (!searchParams.get("id") || !getUser()) {
					setNotFound(true);
					return;
				}

				const { data: res } = await axios.post(
					"https://api.silentclient.net/plus/check_pay",
					{
						id: searchParams.get("id"),
					},
					{
						headers: {
							Authorization: `Bearer ${getUser()?.accessToken}`,
						},
					}
				);

				if (!res.bill.payed) {
					setNotFound(true);
				}
			} catch {
				setNotFound(true);
			} finally {
				setIsLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	return isLoading ? (
		<Center w="full" h="70vh">
			<Spinner size="xl" />
		</Center>
	) : notFound ? (
		<NotFound />
	) : (
		<Container w="full">
			<Title title="Thank you for your purchase | Silent Client" />
			<Center>
				<Stack spacing={16}>
					<Stack spacing={2}>
						<Center>
							<Heading size="xl" textAlign="center">
								Thank you for your purchase
							</Heading>
						</Center>
						<Center>
							<Text fontSize="xl" textAlign="center">
								Silent+ subscription has been activated on your account.
							</Text>
						</Center>
					</Stack>
					<Center>
						<RLink to="/plus">
							<Button>Go to Silent+</Button>
						</RLink>
					</Center>
				</Stack>
			</Center>
		</Container>
	);
}

export default Success;

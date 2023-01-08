import {
	Box,
	Center,
	Spinner,
	Stack,
	Text,
	useToast,
	Heading,
	TabList,
	Tabs,
	TabPanels,
	TabPanel,
	Tab,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React from "react";
import { Title } from "react-head-meta";
import { getUser, UserData } from "../../hooks/auth";
import CustomCape from "./tabs/CustomCape";
import Promo from "./Promo";
import Settings from "./tabs/Settings";

function Plus() {
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [account, setAccount] = React.useState<UserData | null>(null);
	const toast = useToast();

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				if (!getUser()) {
					return;
				}
				const { data: account } = await axios.get(
					`https://api.silentclient.net/account`,
					{
						headers: {
							authorization: `Bearer ${getUser()?.accessToken}`,
						},
					}
				);

				setAccount(account.account);
			} catch (err: any) {
				if (err?.response && err.response?.data && err.response.data?.errors) {
					if (err?.response.status === 404) {
						return;
					}
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

		getData();
		// eslint-disable-next-line
	}, []);

	return isLoading ? (
		<Center w="full" h="70vh">
			<Spinner size="xl" />
		</Center>
	) : (
		<Box>
			<Title title="Silent+ | Silent Client Store" />
			{(account?.is_plus && (
				<Stack direction="column" spacing={5}>
					<Stack direction="column" spacing={2}>
						<Center>
							<Heading
								fontSize="4rem"
								fontWeight="bold"
								textTransform="uppercase"
								textAlign="center"
								textShadow="0px 3px 0px rgba(0,0,0,0.16)"
							>
								Silent<span className="plus">+</span>
							</Heading>
						</Center>
						<Center>
							<Text fontSize="xl" textAlign="center">
								Your Silent+ subscription is active until{" "}
								{moment(getUser()?.plus_expiration).format("L")}.
							</Text>
						</Center>
					</Stack>
					<Tabs variant="soft-rounded" colorScheme="whiteAlpha">
						<Center>
							<TabList>
								<Tab>Custom Cape</Tab>
								<Tab>Settings</Tab>
							</TabList>
						</Center>

						<TabPanels>
							<TabPanel>
								<CustomCape />
							</TabPanel>
							<TabPanel>
								<Settings />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Stack>
			)) || <Promo />}
		</Box>
	);
}

export default Plus;

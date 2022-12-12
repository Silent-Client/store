import {
	Box,
	Center,
	Heading,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	useToast,
	Spinner,
	SimpleGrid,
	Button,
	Stack,
	Image,
	Text,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { StoreItemType } from "../components/StoreItem";
import { getUser } from "../hooks/auth";

function Account() {
	const [capes, setCapes] = React.useState<StoreItemType[] | null>(null);
	const [wings, setWings] = React.useState<StoreItemType[] | null>(null);

	const [selectedCape, setSelectedCape] = React.useState<number | null>(null);
	const [selectedWings, setSelectedWings] = React.useState<number | null>(null);

	const toast = useToast();

	React.useEffect(() => {
		const getData = async () => {
			try {
				const { data: account } = await axios.get(
					"https://api.silentclient.ml/account",
					{
						headers: {
							Authorization: `Bearer ${getUser()?.accessToken}`,
						},
					}
				);

				setSelectedCape(account.account.selected_cape);
				setSelectedWings(account.account.selected_wings);

				setCapes(account.account.cosmetics.capes);

				setWings(account.account.cosmetics.wings);
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
			<Title title="My account | Silent Client Store" />
			<Center w="full">
				<Heading>My cosmetics</Heading>
			</Center>
			<Box mt={5}>
				{((capes !== null || wings !== null) && (
					<Tabs variant="soft-rounded" colorScheme={"whiteAlpha"}>
						<Center w="full">
							<TabList>
								<Tab>Capes</Tab>
								<Tab>Wings</Tab>
							</TabList>
						</Center>

						<TabPanels>
							<TabPanel>
								{capes?.length === 0 && (
									<Center w="full" mt={5}>
										<Heading size="md">Capes not found</Heading>
									</Center>
								)}
								<SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
									{capes?.map(cape => (
										<Stack
											direction="column"
											overflow="hidden"
											boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
											bgColor="#131313"
											borderRadius="md"
										>
											<Center
												userSelect="none"
												w="full"
												h="250px"
												padding="10px"
											>
												<Image
													w="230px"
													h="230px"
													draggable="false"
													loading="lazy"
													src={`https://api.silentclient.ml${cape.preview}`}
												/>
											</Center>
											<Stack
												padding="10px"
												direction={["column", "row"]}
												spacing={["5px", "0px"]}
												justifyContent={"space-between"}
											>
												<Center h={["auto", "full"]}>
													<Text fontSize={20} fontWeight={600} color="white">
														{cape.name}
													</Text>
												</Center>
												<Button
													w={["full", "auto"]}
													onClick={async () => {
														setSelectedCape(
															selectedCape === cape.id ? null : cape.id
														);
														try {
															await axios.post(
																"https://api.silentclient.ml/account/select_cape",
																{
																	id: selectedCape === cape.id ? null : cape.id,
																},
																{
																	headers: {
																		Authorization: `Bearer ${
																			getUser()?.accessToken
																		}`,
																	},
																}
															);
														} catch (err: any) {
															if (
																err?.response &&
																err.response?.data &&
																err.response.data?.errors
															) {
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
													}}
												>
													{selectedCape === cape.id ? "Unselect" : "Select"}
												</Button>
											</Stack>
										</Stack>
									))}
								</SimpleGrid>
							</TabPanel>
							<TabPanel>
								{wings?.length === 0 && (
									<Center w="full" mt={5}>
										<Heading size="md">Wings not found</Heading>
									</Center>
								)}
								<SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
									{wings?.map(wing => (
										<Stack
											direction="column"
											overflow="hidden"
											borderRadius="md"
											boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
											bgColor="#131313"
										>
											<Center
												userSelect="none"
												w="full"
												h="250px"
												padding="10px"
											>
												<Image
													w="230px"
													h="230px"
													draggable="false"
													loading="lazy"
													src={`https://api.silentclient.ml${wing.preview}`}
												/>
											</Center>
											<Stack
												padding="10px"
												direction={["column", "row"]}
												spacing={["5px", "0px"]}
												justifyContent={"space-between"}
											>
												<Center h={["auto", "full"]}>
													<Text fontSize={20} fontWeight={600} color="white">
														{wing.name}
													</Text>
												</Center>
												<Button
													w={["full", "auto"]}
													onClick={async () => {
														setSelectedWings(
															selectedWings === wing.id ? null : wing.id
														);
														try {
															await axios.post(
																"https://api.silentclient.ml/account/select_wings",
																{
																	id:
																		selectedWings === wing.id ? null : wing.id,
																},
																{
																	headers: {
																		Authorization: `Bearer ${
																			getUser()?.accessToken
																		}`,
																	},
																}
															);
														} catch (err: any) {
															if (
																err?.response &&
																err.response?.data &&
																err.response.data?.errors
															) {
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
													}}
												>
													{selectedWings === wing.id ? "Unselect" : "Select"}
												</Button>
											</Stack>
										</Stack>
									))}
								</SimpleGrid>
							</TabPanel>
						</TabPanels>
					</Tabs>
				)) || (
					<Center w="full">
						<Spinner size="xl" />
					</Center>
				)}
			</Box>
		</Box>
	);
}

export default Account;

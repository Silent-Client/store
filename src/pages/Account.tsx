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
	Text,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { StoreItemType } from "../components/StoreItem";
import { getUser } from "../hooks/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Account() {
	const [capes, setCapes] = React.useState<StoreItemType[] | null>(null);
	const [wings, setWings] = React.useState<StoreItemType[] | null>(null);
	const [icons, setIcons] = React.useState<StoreItemType[] | null>(null);

	const [selectedCape, setSelectedCape] = React.useState<number | null>(null);
	const [selectedWings, setSelectedWings] = React.useState<number | null>(null);
	const [selectedIcon, setSelectedIcon] = React.useState<number | null>(null);

	const toast = useToast();

	React.useEffect(() => {
		const getData = async () => {
			try {
				const { data: account } = await axios.get(
					"https://api.silentclient.net/account",
					{
						headers: {
							Authorization: `Bearer ${getUser()?.accessToken}`,
						},
					}
				);

				setSelectedCape(account.account.selected_cape);
				setSelectedWings(account.account.selected_wings);
				setSelectedIcon(account.account.selected_icon);

				setCapes(account.account.cosmetics.capes);

				setWings(account.account.cosmetics.wings);

				setIcons(account.account.cosmetics.icons);
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
				{((capes !== null || wings !== null || icons !== null) && (
					<Tabs variant="soft-rounded" colorScheme={"whiteAlpha"}>
						<Center w="full">
							<TabList>
								<Tab>Capes</Tab>
								<Tab>Wings</Tab>
								<Tab>Nametag Icons</Tab>
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
												<LazyLoadImage
													width="230px"
													height="230px"
													draggable="false"
													alt={cape.name}
													src={`https://api.silentclient.net${cape.preview}`}
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
																"https://api.silentclient.net/account/select_cape",
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
												<LazyLoadImage
													width="230px"
													height="230px"
													draggable="false"
													alt={wing.name}
													src={`https://api.silentclient.net${wing.preview}`}
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
																"https://api.silentclient.net/account/select_wings",
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
							<TabPanel>
								{icons?.length === 0 && (
									<Center w="full" mt={5}>
										<Heading size="md">Icons not found</Heading>
									</Center>
								)}
								<SimpleGrid mt={5} columns={[1, 2, 3]} spacing={2}>
									{icons?.map(icon => (
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
												<Stack direction="row" alignItems="center" spacing={1}>
													<LazyLoadImage
														width="29px"
														height="29px"
														style={{
															minWidth: "29px",
															maxWidth: "29px",
															minHeight: "29px",
															maxHeight: "29px",
														}}
														draggable="false"
														alt={icon.name}
														src={`https://api.silentclient.net${icon.texture}`}
													/>
													<Box bgColor="rgba(0,0,0,0.45)" padding="1px 5px">
														<Center h="full">
															<Text
																textShadow="0px 3px 0px rgba(0,0,0,0.25)"
																fontFamily={`"Minecraft",sans-serif`}
																fontWeight={100}
																fontSize="27.5px"
																color="white"
															>
																{getUser()?.original_username || "Steve"}
															</Text>
														</Center>
													</Box>
												</Stack>
											</Center>
											<Stack
												padding="10px"
												direction={["column", "row"]}
												spacing={["5px", "0px"]}
												justifyContent={"space-between"}
											>
												<Center h={["auto", "full"]}>
													<Text fontSize={20} fontWeight={600} color="white">
														{icon.name}
													</Text>
												</Center>
												<Button
													w={["full", "auto"]}
													onClick={async () => {
														setSelectedIcon(
															selectedIcon === icon.id ? null : icon.id
														);
														try {
															await axios.post(
																"https://api.silentclient.net/account/select_icon",
																{
																	id: selectedIcon === icon.id ? null : icon.id,
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
													{selectedIcon === icon.id ? "Unselect" : "Select"}
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

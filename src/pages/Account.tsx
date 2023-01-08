import {
	Box,
	Center,
	Spinner,
	useToast,
	Stack,
	Text,
	Image,
	TabList,
	Tab,
	TabPanels,
	Tabs,
	TabPanel,
	SimpleGrid,
	Heading,
	Link,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import StoreItem, { StoreItemType } from "../components/StoreItem";
import { getUser, UserData } from "../hooks/auth";
import NotFound from "./NotFound";
import defaultIcon from "../assets/images/logo.svg";
import moment from "moment";
import { Title } from "react-head-meta";
import plus_icon from "../assets/images/plus/plus_icon.svg";

function Account() {
	const { username } = useParams();

	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [notFound, setNotFound] = React.useState<boolean>(false);
	const [account, setAccount] = React.useState<UserData | null>(null);

	const [capes, setCapes] = React.useState<StoreItemType[] | null>(null);
	const [wings, setWings] = React.useState<StoreItemType[] | null>(null);
	const [icons, setIcons] = React.useState<StoreItemType[] | null>(null);

	const [selectedIcon, setSelectedIcon] = React.useState<number>(0);
	const [selectedPlusIcon, setSelectedPlusIcon] = React.useState<number>(0);
	const [selectedWings, setSelectedWings] = React.useState<number>(0);
	const [selectedCape, setSelectedCape] = React.useState<number>(0);

	const toast = useToast();

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const { data: account } = await axios.get(
					`https://api.silentclient.net/account/${username}`
				);

				setAccount(account.account);

				setCapes(account.account.cosmetics.capes);
				setWings(account.account.cosmetics.wings);
				setIcons(account.account.cosmetics.icons);

				setSelectedIcon(account.account.selected_icon);
				setSelectedWings(account.account.selected_wings);
				setSelectedCape(account.account.selected_cape);
				setSelectedPlusIcon(account.account.plus_icon);
			} catch (err: any) {
				setNotFound(true);
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
	}, [username]);

	return isLoading ? (
		<Center w="full" h="70vh">
			<Spinner size="xl" />
		</Center>
	) : notFound ? (
		<NotFound />
	) : (
		<Stack
			direction={["column", "row"]}
			spacing={[5, 0]}
			justifyContent="space-between"
			h="full"
		>
			<Title title={`${account?.original_username} | Silent Client`} />
			<Stack
				bgColor="#131313"
				w={["full", "350px"]}
				direction="column"
				spacing={5}
				boxShadow="8px 0 10px 0 rgba(0,0,0,0.24)"
				padding="15px 20px 25px 20px"
				borderRadius="lg"
				h={"auto"}
				maxHeight={["auto", "600px"]}
			>
				<Center>
					<Center as={Stack} direction="row" spacing={1}>
						<Center h="full">
							<LazyLoadImage
								width="auto"
								height="auto"
								style={{
									minWidth: "29px",
									maxWidth: "29px",
									minHeight: "29px",
									maxHeight: "29px",
								}}
								draggable="false"
								src={
									selectedPlusIcon
										? plus_icon
										: selectedIcon !== 0
										? `https://cosmetics.silentclient.net/icons/${account?.username}.png`
										: defaultIcon
								}
							/>
						</Center>
						<Box padding="1px 5px">
							<Center h="full">
								<Text
									textShadow="0px 3px 0px rgba(0,0,0,0.25)"
									fontWeight={600}
									fontSize="27.5px"
									color="white"
								>
									{account?.original_username || "Steve"}
								</Text>
							</Center>
						</Box>
						{account?.is_online && <Text color="green">online</Text>}
					</Center>
				</Center>
				<Center>
					<Image
						src={`https://mc-heads.net/body/${account?.username}`}
						w="130px"
						h="312px"
						fallbackSrc={"https://mc-heads.net/body/MHF_Steve"}
					/>
				</Center>
				<Stack direction={"column"} spacing={1}>
					<Stack direction="row" justifyContent="space-between">
						<Text color="white" opacity="0.5">
							Link:
						</Text>
						<Text color="white">
							<Link
								color="#2caddc"
								href={`https://silentclient.net/u/${account?.original_username}`}
							>
								silentclient.net/u/{account?.original_username}
							</Link>
						</Text>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Text color="white" opacity="0.5">
							Last Online:
						</Text>
						<Text color="white">
							{account?.last_online
								? moment(account.last_online).format("L")
								: "N/A"}
						</Text>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Text color="white" opacity="0.5">
							Join Date:
						</Text>
						<Text color="white">{moment(account?.created_at).format("L")}</Text>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Text color="white" opacity="0.5">
							Capes:
						</Text>
						<Text color="white">{capes?.length}</Text>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Text color="white" opacity="0.5">
							Wings:
						</Text>
						<Text color="white">{wings?.length}</Text>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Text color="white" opacity="0.5">
							Icons:
						</Text>
						<Text color="white">{icons?.length}</Text>
					</Stack>
				</Stack>
			</Stack>
			<Tabs w="full" variant="soft-rounded" colorScheme={"whiteAlpha"}>
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
						<SimpleGrid mt={5} spacing={2} columns={[1, 2, 3]}>
							{capes?.map(cape => (
								<StoreItem
									key={cape.id}
									type="capes"
									data={cape}
									pageType={
										account?.original_username === getUser()?.original_username
											? "account"
											: "store"
									}
									selectedItem={selectedCape}
									setSelectedItem={setSelectedCape}
								/>
							))}
						</SimpleGrid>
					</TabPanel>
					<TabPanel>
						{wings?.length === 0 && (
							<Center w="full" mt={5}>
								<Heading size="md">Wings not found</Heading>
							</Center>
						)}
						<SimpleGrid mt={5} spacing={2} columns={[1, 2, 3]}>
							{wings?.map(wing => (
								<StoreItem
									key={wing.id}
									type="wings"
									data={wing}
									pageType={
										account?.original_username === getUser()?.original_username
											? "account"
											: "store"
									}
									selectedItem={selectedWings}
									setSelectedItem={setSelectedWings}
								/>
							))}
						</SimpleGrid>
					</TabPanel>
					<TabPanel>
						{icons?.length === 0 && (
							<Center w="full" mt={5}>
								<Heading size="md">Icons not found</Heading>
							</Center>
						)}
						<SimpleGrid mt={5} spacing={2} columns={[1, 2, 3]}>
							{icons?.map(icon => (
								<StoreItem
									key={icon.id}
									type="icons"
									data={icon}
									username={account?.original_username}
									pageType={
										account?.original_username === getUser()?.original_username
											? "account"
											: "store"
									}
									selectedItem={selectedIcon}
									setSelectedItem={setSelectedIcon}
								/>
							))}
						</SimpleGrid>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Stack>
	);
}

export default Account;

import {
	Box,
	Button,
	Center,
	Heading,
	Image,
	SimpleGrid,
	Stack,
	Text,
	useToast,
	Link,
} from "@chakra-ui/react";
import React from "react";
import { getUser } from "../../hooks/auth";
import plus_icon from "../../assets/images/plus/plus_icon.svg";
import custom_cape from "../../assets/images/plus/custom_cape.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../../css/plus.css";
import StoreItem from "../../components/StoreItem";
import { useNavigate } from "react-router";
import axios from "axios";

function Promo() {
	const [type, setType] = React.useState<number>(1);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const toast = useToast();
	const navigate = useNavigate();

	const buy = async () => {
		if (!getUser()) {
			navigate("/login");
			return;
		}
		setIsLoading(true);
		try {
			const { data: res } = await axios.post(
				"https://api.silentclient.net/plus/buy",
				{
					type: type,
				},
				{
					headers: {
						Authorization: `Bearer ${getUser()?.accessToken}`,
					},
				}
			);

			if (res.errors) {
				for (const error of res.errors) {
					toast({
						title: "Error!",
						description: error.message,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
				return;
			}

			window.location.href = res.payUrl;
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
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box>
			<Center mb={"10rem"} h="70vh">
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
							Help support the development of Silent Client and gain awesome
							perks!
						</Text>
					</Center>
				</Stack>
			</Center>
			<Stack
				id="feature_1"
				direction={["column-reverse", "row"]}
				spacing={5}
				justifyContent="space-between"
				mb={"10rem"}
			>
				<Center
					as={Stack}
					direction="column"
					spacing={2}
					className="plus_feature_image"
					h="full"
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
							alt={"Plus Icon"}
							src={plus_icon}
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
					<Image
						src={`https://mc-heads.net/body/${
							getUser()?.original_username || "MHF_Steve"
						}`}
						w="130px"
						h="312px"
						fallbackSrc={"https://mc-heads.net/body/MHF_Steve"}
					/>
				</Center>
				<Stack
					id="feature_2"
					w="full"
					justifyContent={["center", "left"]}
					direction="column"
					spacing={5}
				>
					<Heading
						textShadow="0px 3px 0px rgba(0,0,0,0.16)"
						fontSize={["3xl", "4.25rem"]}
						textAlign={["center", "left"]}
					>
						Exclusive Nametag Icon
					</Heading>
					<Text textAlign={["center", "left"]} maxWidth="800px" fontSize="xl">
						Want to stand out more in the game? This exclusive Nametag Icon will
						help you stand out from the rest. The logo is displayed in the tab,
						as well as above your head in a multiplayer game.
					</Text>
					<Center w="full" justifyContent={["center", "left"]}>
						<Button
							minWidth="130px"
							as={Link}
							className={"plus_buy_button"}
							href="#buy_plus"
						>
							Subscribe
						</Button>
					</Center>
				</Stack>
			</Stack>
			<Stack
				id="feature_3"
				direction={["column-reverse", "row"]}
				spacing={5}
				justifyContent="space-between"
				mb={"10rem"}
			>
				<Center
					as={Stack}
					direction="column"
					spacing={2}
					className="plus_feature_image"
					h="full"
				>
					<LazyLoadImage src={custom_cape} width="312px" height="312px" />
				</Center>
				<Stack
					w="full"
					justifyContent={["center", "left"]}
					direction="column"
					spacing={5}
				>
					<Heading
						textShadow="0px 3px 0px rgba(0,0,0,0.16)"
						fontSize={["3xl", "4.25rem"]}
						textAlign={["center", "left"]}
					>
						Custom Capes
					</Heading>
					<Text textAlign={["center", "left"]} maxWidth="800px" fontSize="xl">
						Get creative and create your own custom cape that all other Silent
						Client players will see. There are no limits, create the cape you
						want!
					</Text>
					<Center w="full" justifyContent={["center", "left"]}>
						<Button
							minWidth="130px"
							as={Link}
							className={"plus_buy_button"}
							href="#buy_plus"
						>
							Subscribe
						</Button>
					</Center>
				</Stack>
			</Stack>
			<Stack
				direction={["column-reverse", "row"]}
				spacing={5}
				justifyContent="space-between"
				mb={"10rem"}
			>
				<Center
					as={Stack}
					direction="column"
					spacing={2}
					className="plus_feature_image"
					h="full"
				>
					<StoreItem
						data={{
							id: 2,
							texture: "/cosmetics/textures/capes/silent_client_white.png",
							name: "Silent Client White",
							price: 129,
							sale_price: 129,
							normal_price: 129,
							category: "Silent Client",
							preview:
								"/cosmetics/textures/capes/preview/silent_client_white.png",
							created_at: "2022-12-09T20:50:22.000+03:00",
							updated_at: "2022-12-09T20:50:22.000+03:00",
						}}
						type="capes"
						isPlusPromo
					></StoreItem>
				</Center>
				<Stack
					w="full"
					justifyContent={["center", "left"]}
					direction="column"
					spacing={5}
				>
					<Heading
						textShadow="0px 3px 0px rgba(0,0,0,0.16)"
						fontSize={["3xl", "4.25rem"]}
						textAlign={["center", "left"]}
					>
						10% Off of cosmetics across the entire store
					</Heading>
					<Text textAlign={["center", "left"]} maxWidth="800px" fontSize="xl">
						Save on all future purchases when shopping on the Silent Client
						Store. Silent+ will automatically apply a 10% store-wide discount on
						your account.
					</Text>
					<Center w="full" justifyContent={["center", "left"]}>
						<Button
							minWidth="130px"
							as={Link}
							className={"plus_buy_button"}
							href="#buy_plus"
						>
							Subscribe
						</Button>
					</Center>
				</Stack>
			</Stack>

			<Center id="buy_plus">
				<Heading textAlign="center">Subscribe to Silent+</Heading>
			</Center>
			<Stack direction="column" padding={5} spacing={5}>
				<Center>
					<Heading size="lg">Duration</Heading>
				</Center>
				<Box paddingLeft={[0, 5]} paddingRight={[0, 5]}>
					<SimpleGrid columns={[1, 2, 3]} spacing={5}>
						<Button
							onClick={() => {
								setType(1);
							}}
							isDisabled={isLoading}
							variant={type === 1 ? "solid" : "outline"}
							size="lg"
						>
							1 month
						</Button>
						<Button
							size="lg"
							isDisabled={isLoading}
							onClick={() => {
								setType(3);
							}}
							variant={type === 3 ? "solid" : "outline"}
						>
							3 month
						</Button>
						<Button
							size="lg"
							isDisabled={isLoading}
							onClick={() => {
								setType(6);
							}}
							variant={type === 6 ? "solid" : "outline"}
						>
							6 month
						</Button>
					</SimpleGrid>
					<Stack mt={5} direction="row" justifyContent="space-between">
						<Heading>
							{type === 1 ? (
								<span>149 RUB</span>
							) : type === 3 ? (
								<>
									<span
										style={{ textDecoration: "line-through", color: "#db4040" }}
									>
										447
									</span>{" "}
									399 RUB
								</>
							) : (
								<>
									<span
										style={{ textDecoration: "line-through", color: "#db4040" }}
									>
										894
									</span>{" "}
									799 RUB
								</>
							)}
						</Heading>
						<Button
							isDisabled={isLoading}
							onClick={buy}
							mt={5}
							minWidth="130px"
						>
							Subscribe
						</Button>
					</Stack>
					<Text>
						All Silent+ subscription features are only available on the{" "}
						<b>Experimental Branch</b>
					</Text>
				</Box>
			</Stack>
		</Box>
	);
}

export default Promo;

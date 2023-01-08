import { Center, Stack, Text, Button, useToast, Box } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../hooks/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";

export type StoreItemType = {
	id: number;
	texture: string;
	name: string;
	price: number;
	sale_price: number;
	normal_price: number;
	category: string;
	preview: string;
	created_at: string;
	updated_at: string;
};

function StoreItem({
	data,
	type,
	pageType = "store",
	username,
	selectedItem,
	setSelectedItem,
	isPlusPromo,
}: {
	data: StoreItemType;
	type: "capes" | "wings" | "icons";
	pageType?: "account" | "store";
	username?: string;
	selectedItem?: number;
	setSelectedItem?: any;
	isPlusPromo?: boolean;
}) {
	const navigate = useNavigate();

	const toast = useToast();

	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const buyItem = async () => {
		if (!getUser()) {
			navigate("/login");
			return;
		}
		setIsLoading(true);
		try {
			const { data: res } = await axios.post(
				"https://api.silentclient.net/store/buy_cosmetics",
				{
					id: data.id,
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
		<Stack
			direction="column"
			overflow="hidden"
			borderRadius="lg"
			boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
			bgColor="#131313"
		>
			<Center w="full" h="250px" userSelect="none" padding="10px">
				{(type !== "icons" && (
					<LazyLoadImage
						width="230px"
						height="230px"
						draggable="false"
						alt={data.name}
						src={`https://api.silentclient.net${data.preview}`}
					/>
				)) || (
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
							alt={data.name}
							src={`https://api.silentclient.net${data.texture}`}
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
									{username || getUser()?.original_username || "Steve"}
								</Text>
							</Center>
						</Box>
					</Stack>
				)}
			</Center>
			<Stack
				padding="10px"
				direction={["column", "row"]}
				spacing={["5px", "0px"]}
				justifyContent={"space-between"}
			>
				<Stack direction="column" spacing="0px">
					<Text fontSize={16} fontWeight={600} color="white">
						{data.name}
					</Text>
					{pageType === "store" && (
						<Text fontSize={16}>
							<span
								style={{
									textDecoration:
										getUser()?.is_plus || isPlusPromo ? "line-through" : "none",
								}}
							>
								{data.price}₽
							</span>{" "}
							{getUser()?.is_plus || isPlusPromo ? (
								<span>{Math.round(data.price - data.price * 0.1)}₽</span>
							) : (
								""
							)}
						</Text>
					)}
				</Stack>
				{(pageType === "store" && (
					<Button
						w={["full", "auto"]}
						isDisabled={isLoading}
						onClick={
							isPlusPromo
								? () => {
										console.log("Is preview!");
								  }
								: buyItem
						}
					>
						Buy
					</Button>
				)) || (
					<Button
						w={["full", "auto"]}
						onClick={async () => {
							setSelectedItem(selectedItem === data.id ? 0 : data.id);

							try {
								await axios.post(
									"https://api.silentclient.net/account/select_" +
										(type === "capes"
											? "cape"
											: type === "wings"
											? "wings"
											: "icon"),
									{
										id: selectedItem === data.id ? null : data.id,
									},
									{
										headers: {
											Authorization: `Bearer ${getUser()?.accessToken}`,
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
						{selectedItem === data.id ? "Unselect" : "Select"}
					</Button>
				)}
			</Stack>
		</Stack>
	);
}

export default StoreItem;

import {
	Box,
	Center,
	FormControl,
	FormLabel,
	Heading,
	Stack,
	useToast,
	Image,
	Checkbox,
	Spinner,
	Container,
	Button,
} from "@chakra-ui/react";
import React from "react";
import { SkinViewer } from "skinview3d";
import { getUser, UserData } from "../../../hooks/auth";
import FilePicker from "chakra-ui-file-picker";
import custom_cape from "../../../assets/images/plus/custom_cape.png";
import axios from "axios";

function CustomCape() {
	const [account, setAccount] = React.useState<UserData | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isLoadingFirst, setIsLoadingFirst] = React.useState<boolean>(true);
	const [enabled, setEnabled] = React.useState<boolean>(false);
	const toast = useToast();

	const [preview, setPreview] = React.useState<string>(
		`https://cosmetics.silentclient.net/capes/${getUser()?.username}.png`
	);
	const [texture, setTexture] = React.useState<File | null>(null);
	React.useEffect(() => {
		const getData = async () => {
			setIsLoadingFirst(true);
			try {
				const { data: account } = await axios.get(
					"https://api.silentclient.net/account",
					{
						headers: {
							authorization: `Bearer ${getUser()?.accessToken}`,
						},
					}
				);

				setEnabled(account.account.custom_cape ? true : false);
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
				setIsLoadingFirst(false);
			}

			try {
				const skinViewer = new SkinViewer({
					width: 685,
					height: 685,
					renderPaused: true,
					zoom: 1.5,
				});
				skinViewer.camera.rotation.x = -2.9445863039147926;
				skinViewer.camera.rotation.y = -0.24129215654046646;
				skinViewer.camera.rotation.z = -3.0939339772752144;
				skinViewer.camera.position.x = -6.712216245243998;
				skinViewer.camera.position.y = 5.338818424577546;
				skinViewer.camera.position.z = -26.748223451710654;

				try {
					await Promise.all([
						skinViewer.loadSkin(null),
						skinViewer.loadCape(
							`https://cosmetics.silentclient.net/capes/${
								getUser()?.username
							}.png`
						),
					]);
				} catch {
					return;
				}
				skinViewer.render();

				setPreview(skinViewer.canvas.toDataURL());

				skinViewer.dispose();
			} catch {
				return;
			}
		};

		getData();
	}, []);
	const changePreview = async (files: File[]) => {
		const skinViewer = new SkinViewer({
			width: 685,
			height: 685,
			renderPaused: true,
			zoom: 1.5,
		});
		skinViewer.camera.rotation.x = -2.9445863039147926;
		skinViewer.camera.rotation.y = -0.24129215654046646;
		skinViewer.camera.rotation.z = -3.0939339772752144;
		skinViewer.camera.position.x = -6.712216245243998;
		skinViewer.camera.position.y = 5.338818424577546;
		skinViewer.camera.position.z = -26.748223451710654;

		try {
			await Promise.all([
				skinViewer.loadSkin(null),
				skinViewer.loadCape(URL.createObjectURL(files[0])),
			]);
		} catch {
			toast({
				title: "Error!",
				description: "Is not cape texture!",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		skinViewer.render();

		setPreview(skinViewer.canvas.toDataURL());
		setTexture(files[0]);

		skinViewer.dispose();
	};

	const save = async () => {
		setIsLoading(true);
		try {
			const data = new FormData();
			data.append("enabled", enabled ? "1" : "0");
			data.append("texture", texture || "");
			await axios.post(
				"https://api.silentclient.net/plus/set_custom_cape",
				data,
				{
					headers: {
						authorization: `Bearer ${getUser()?.accessToken}`,
					},
				}
			);

			toast({
				title: "Success!",
				description: `The cloak will be updated within a few minutes. If it doesn't, clear the site's cache, or if you're in a game, press the "Reload Resources" button in the ESC menu.`,
				status: "success",
				duration: 6000,
				isClosable: true,
			});
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

	return !isLoadingFirst ? (
		<Center>
			<Container maxW="3xl">
				<Stack
					direction={["column-reverse", "row"]}
					spacing={5}
					justifyContent="space-between"
				>
					<Box justifyContent={["center", "left"]}>
						<Stack
							justifyContent={["center", "left"]}
							alignItems={["center", "left"]}
							textAlign={["center", "left"]}
							direction="column"
							spacing={2}
						>
							<Heading size="lg">Preview</Heading>
							<Image
								src={preview}
								fallbackSrc={custom_cape}
								w="230px"
								h="230px"
							/>
						</Stack>
					</Box>
					<Box justifyContent={["center", "right"]}>
						<Stack
							direction="column"
							spacing={2}
							padding={5}
							borderRadius="lg"
							boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
							bgColor="#131313"
						>
							<Center>
								<Heading size="lg">Customize Cape</Heading>
							</Center>
							<Checkbox
								size="lg"
								isDisabled={isLoading}
								isChecked={enabled}
								onChange={async e => {
									setEnabled(e.target.checked);
									try {
										await axios.post(
											"https://api.silentclient.net/plus/set_custom_cape",
											{
												enabled: e.target.checked,
											},
											{
												headers: {
													authorization: `Bearer ${getUser()?.accessToken}`,
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
								Enabled
							</Checkbox>

							<Center>
								<FormControl>
									<FormLabel>Cape Texture</FormLabel>
									<FilePicker
										onFileChange={changePreview}
										placeholder={"Texture"}
										clearButtonLabel="label"
										multipleFiles={false}
										hideClearButton={true}
									/>
								</FormControl>
							</Center>
							<Center>
								<Button isDisabled={isLoading} onClick={save} w="full">
									Save
								</Button>
							</Center>
						</Stack>
					</Box>
				</Stack>
			</Container>
		</Center>
	) : (
		<Center w="full">
			<Spinner size="xl" />
		</Center>
	);
}

export default CustomCape;

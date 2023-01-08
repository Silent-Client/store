import {
	Center,
	Stack,
	Spinner,
	Checkbox,
	useToast,
	Heading,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { getUser } from "../../../hooks/auth";

function Settings() {
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [nametagIcon, setNametagIcon] = React.useState<boolean>(false);
	const toast = useToast();

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const { data: account } = await axios.get(
					"https://api.silentclient.net/account",
					{
						headers: {
							authorization: `Bearer ${getUser()?.accessToken}`,
						},
					}
				);

				setNametagIcon(account.account.plus_icon ? true : false);
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

		getData();
	}, []);

	return !isLoading ? (
		<Center>
			<Stack
				direction="column"
				spacing={2}
				padding={5}
				borderRadius="lg"
				boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
				bgColor="#131313"
			>
				<Stack spacing={2} direction="column">
					<Center>
						<Heading size="lg">Settings</Heading>
					</Center>
					<Checkbox
						size="lg"
						isDisabled={isLoading}
						isChecked={nametagIcon}
						onChange={async e => {
							setNametagIcon(e.target.checked);
							try {
								await axios.post(
									"https://api.silentclient.net/plus/set_icon",
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
						Plus Nametag Icon
					</Checkbox>
				</Stack>
			</Stack>
		</Center>
	) : (
		<Center w="full">
			<Spinner size="xl" />
		</Center>
	);
}

export default Settings;

import React from "react";
import {
	Container,
	Box,
	Stack,
	Link,
	Image,
	Center,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";

import full_logo from "../../assets/images/full_logo.svg";
import { getUser, logout } from "../../hooks/auth";

function Header() {
	const location = useLocation();
	return (
		<Box bgColor="black" position="relative" w="full" zIndex={2} as="header">
			<Container minW="full" ml="auto" mr="auto" pl="20px" pr="20px">
				<Stack direction="row" h="77px" justifyContent="space-between">
					<Center
						w={["auto", "full"]}
						justifyContent={["center", "left"]}
						h="full"
					>
						<Link
							display={["block", "block"]}
							w="auto"
							userSelect={"none"}
							as={RLink}
							to="/"
						>
							<Image h="39px" w="auto" src={full_logo} />
						</Link>
					</Center>

					<Center w="full" h="full" display={["none", "flex"]}>
						<Stack direction="row" spacing={5}>
							<RLink to="/capes">
								<Link
									color={
										location.pathname === "/capes"
											? "white"
											: "rgb(114, 114, 114)"
									}
									fontSize="18px"
									fontWeight={600}
									_hover={{
										color: "white",
										textDecoration: "none",
									}}
								>
									Capes
								</Link>
							</RLink>
							<RLink to="/wings">
								<Link
									color={
										location.pathname === "/wings"
											? "white"
											: "rgb(114, 114, 114)"
									}
									fontSize="18px"
									fontWeight={600}
									_hover={{
										color: "white",
										textDecoration: "none",
									}}
								>
									Wings
								</Link>
							</RLink>
							<RLink to="/icons">
								<Link
									color={
										location.pathname === "/icons"
											? "white"
											: "rgb(114, 114, 114)"
									}
									fontSize="18px"
									fontWeight={600}
									_hover={{
										color: "white",
										textDecoration: "none",
									}}
								>
									Nametag Icons
								</Link>
							</RLink>
							<RLink to="/plus">
								<Link
									color={
										location.pathname === "/plus"
											? "white"
											: "rgb(114, 114, 114)"
									}
									fontSize="18px"
									fontWeight={600}
									_hover={{
										color: "white",
										textDecoration: "none",
									}}
								>
									Silent<span className="plus">+</span>
								</Link>
							</RLink>
						</Stack>
					</Center>
					<Center
						w={["auto", "full"]}
						justifyContent={["center", "right"]}
						h="full"
					>
						{(getUser() && (
							<Menu>
								<MenuButton as={Link} w="45px">
									<Image
										src={`https://mc-heads.net/avatar/${
											getUser()?.original_username
										}`}
										w="45px"
										h="45px"
										borderRadius={"md"}
									/>
								</MenuButton>
								<MenuList bgColor="black">
									<MenuItem
										bgColor="transparent"
										_hover={{
											bgColor: "#131313",
										}}
										as={RLink}
										to="/account"
									>
										Account
									</MenuItem>
									<MenuItem
										bgColor="transparent"
										_hover={{
											bgColor: "#131313",
										}}
										display={["flex", "none"]}
										as={RLink}
										to="/plus"
									>
										Silent+
									</MenuItem>
									<MenuItem
										bgColor="transparent"
										_hover={{
											bgColor: "#131313",
										}}
										as={RLink}
										to="/edit_account"
									>
										Edit account
									</MenuItem>
									<MenuItem
										bgColor="transparent"
										_hover={{
											bgColor: "#131313",
										}}
										onClick={logout}
									>
										Logout
									</MenuItem>
								</MenuList>
							</Menu>
						)) || (
							<RLink to="/login">
								<Button
									variant="outline"
									minWidth={["60px", "70px"]}
									borderColor="white"
								>
									Login
								</Button>
							</RLink>
						)}
					</Center>
				</Stack>
			</Container>
		</Box>
	);
}

export default Header;

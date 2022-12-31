import axios from "axios";

interface UserData {
	id: number;
	accessToken: string;
	username: string;
	email: string;
	original_username: string;
	is_admin: number;
	created_at: string;
}

const Store = window.localStorage;

function setAuth(user: UserData) {
	Store.setItem(
		"auth-data",
		JSON.stringify({
			id: user.id,
			accessToken: user.accessToken,
			email: user.email,
			username: user.username,
			original_username: user.original_username,
			is_admin: user.is_admin,
			created_at: user.created_at,
		})
	);
}

function getUser() {
	const data = Store.getItem("auth-data");

	if (!data) {
		return null;
	} else {
		let userData: UserData = JSON.parse(data);
		return userData;
	}
}

async function logout() {
	Store.clear();
	window.location.href = "/";
}

async function getAuth() {
	const user = getUser();

	if (!user) {
		return false;
	}

	await updateAuth();

	try {
		const { data: res } = await axios.get(
			`https://api.silentclient.net/account`,
			{
				headers: {
					authorization: `Bearer ${user.accessToken}`,
				},
			}
		);

		if (res.errors) {
			logout();
			return false;
		}

		return true;
	} catch {
		logout();
		return false;
	}
}

async function login(username: string, password: string) {
	try {
		const { data: res } = await axios.post(
			"https://api.silentclient.net/auth/login",
			{
				email: username,
				password: password,
			}
		);

		if (!res.auth.token) return { errors: ["bad login or pass"] };

		const { data: user } = await axios.get(
			`https://api.silentclient.net/account`,
			{
				headers: {
					authorization: `Bearer ${res.auth.token}`,
				},
			}
		);

		if (user.errors) return { errors: user.errors };

		let userData: UserData = {
			id: user.account.id,
			accessToken: res.auth.token,
			username: user.account.username,
			email: user.account.email,
			original_username: user.account.original_username,
			is_admin: user.account.is_admin,
			created_at: user.account.created_at,
		};

		setAuth(userData);

		return { errors: null };
	} catch (e: any) {
		return { errors: e.response.data.errors };
	}
}

async function register(username: string, email: string, password: string) {
	try {
		const { data: res } = await axios.post(
			"https://api.silentclient.net/auth/register",
			{
				username: username,
				email: email,
				password: password,
			}
		);

		if (res.errors) return { errors: res.errors };

		const { data: user } = await axios.get(
			`https://api.silentclient.net/account`,
			{
				headers: {
					authorization: `Bearer ${res.auth.token}`,
				},
			}
		);

		if (user.errors) return { errors: user.errors };

		let userData: UserData = {
			id: user.account.id,
			accessToken: res.auth.token,
			email: user.account.email,
			username: user.account.username,
			original_username: user.account.original_username,
			is_admin: user.account.is_admin,
			created_at: user.account.created_at,
		};

		setAuth(userData);

		return { errors: null };
	} catch (e: any) {
		return { errors: e.response.data.errors };
	}
}

async function updateAuth() {
	const user = getUser();
	if (!user) {
		logout();
		return { error: "not auth" };
	}

	try {
		const { data: res } = await axios.get(
			`https://api.silentclient.net/account`,
			{
				headers: {
					authorization: `Bearer ${user.accessToken}`,
				},
			}
		);

		if (res.errors) {
			logout();
			return { errors: true };
		}

		let userData: UserData = {
			id: res.account.id,
			accessToken: user.accessToken,
			username: res.account.username,
			email: res.account.email,
			original_username: res.account.original_username,
			is_admin: res.account.is_admin,
			created_at: res.account.created_at,
		};

		setAuth(userData);

		return { error: false };
	} catch {
		logout();
		return { error: true };
	}
}

export type { UserData };
export { getAuth, getUser, setAuth, logout, login, updateAuth, register };

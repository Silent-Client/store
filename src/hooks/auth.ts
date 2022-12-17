import axios from "axios";

interface UserData {
  id: number;
  accessToken: string;
  username: string;
  is_admin: number;
}

const Store = window.localStorage;

function setAuth(user: UserData) {
  Store.setItem(
    "auth-data",
    JSON.stringify({
      id: user.id,
      accessToken: user.accessToken,
      username: user.username,
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
        username: username,
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
      is_admin: user.account.is_admin,
    };

    setAuth(userData);

    return { errors: null };
  } catch (e: any) {
    return { errors: e.response.data.errors };
  }
}

async function register(username: string, password: string) {
  try {
    const { data: res } = await axios.post(
      "https://api.silentclient.net/auth/register",
      {
        username: username,
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
      username: user.account.username,
      is_admin: user.account.is_admin,
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
      is_admin: res.account.is_admin,
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

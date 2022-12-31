import { getUser } from "../hooks/auth";
import { Navigate } from "react-router";

function Account() {
	return <Navigate to={`/account/${getUser()?.original_username}`} />;
}

export default Account;

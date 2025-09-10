import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { useUser } from "../context/userContext";

const Route = () => {
  const { user } = useUser();
  return user ? (
    <AppStack key="app" />
  ) : (
    <AuthStack key="auth" />
  );
};


export default Route;

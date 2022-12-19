import React from "react";
import { Box, Container, Stack } from "@chakra-ui/react";
import Header from "./components/header";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { getAuth, getUser } from "./hooks/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Success from "./pages/Success";
import Account from "./pages/Account";
import Capes from "./pages/Capes";
import Wings from "./pages/Wings";
import Footer from "./components/footer";
import FreeUsername from "./pages/FreeUsername";
import EditProfile from "./pages/EditProfile";

function App() {
  React.useEffect(() => {
    const getData = async () => {
      await getAuth();
    };

    getData();
  }, []);

  return (
    <Box id="silent_app">
      <Stack w="full" h="full" minHeight="100vh" direction="column" spacing={0}>
        <Header />
        <Container maxW="full" id="silent_content" paddingTop={[5, 10]}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />
            <Route path="/capes" element={<Capes />} />
            <Route path="/wings" element={<Wings />} />
            <Route path="/free_username" element={<FreeUsername />} />

            <Route
              path="/account"
              element={getUser() ? <Account /> : <Login />}
            />

            <Route
              path="/edit_profile"
              element={getUser() ? <EditProfile /> : <Login />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Box flex="1" />
        <Footer />
      </Stack>
    </Box>
  );
}

export default App;

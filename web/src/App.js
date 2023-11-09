import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageRender from "./PageRender";
import Login from "./pages/login";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";
import PrivateRouter from "./customRouter/PrivateRouter";
import NavbarMenu from "./components/Shared/NavbarMenu";
import GlobalAlert from "./components/Shared/GlobalAlert";
import Home from "./components/Shared/Home";

function App() {
  const { auth } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <Router>
      <GlobalAlert />
      {auth.token && <NavbarMenu />}
      <Routes>
        <Route path="/" element={auth.token ? <Home /> : <Login />} />
        <Route
          path="/:page"
          element={
            <PrivateRouter>
              <PageRender />
            </PrivateRouter>
          }
        />
        <Route
          path="/:page/:id"
          element={
            <PrivateRouter>
              <PageRender />
            </PrivateRouter>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

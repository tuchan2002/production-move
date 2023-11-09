import React from "react";
import { useSelector } from "react-redux";
import AdminHome from "../../Admin/Home";
import AgentHome from "../../Agent/Home";
import FactoryHome from "../../Factory/Home";
import CenterHome from "../../Center/Home";
import Footer from "../Footer";

const Home = () => {
  const { auth } = useSelector((state) => state);

  const generateHomeComponent = (role) => {
    switch (role) {
      case 1:
        return <AdminHome />;
      case 2:
        return <FactoryHome />;
      case 3:
        return <AgentHome />;
      case 4:
        return <CenterHome />;
      default:
        return "";
    }
  };
  return (
    <>
      {generateHomeComponent(auth.user.role)}
      <Footer />
    </>
  );
};

export default Home;

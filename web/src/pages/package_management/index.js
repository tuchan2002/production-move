import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AgentPackageManagement from "../../components/Agent/PackageManagement";
import FactoryPackageManagement from "../../components/Factory/PackageManagement";

const PackageManagement = () => {
  const { auth } = useSelector((state) => state);

  const generatePackageManagementComponent = (role) => {
    if (role === 2) {
      return <FactoryPackageManagement />;
    } else if (role === 3) {
      return <AgentPackageManagement />;
    }
  };
  return <>{generatePackageManagementComponent(auth.user.role)}</>;
};

export default PackageManagement;

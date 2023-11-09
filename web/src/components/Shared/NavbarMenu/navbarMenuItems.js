import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import DevicesIcon from "@mui/icons-material/Devices";
import PaidIcon from "@mui/icons-material/Paid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";

const navbarMenuItems = [
  [
    {
      icon: <DevicesIcon />,
      text: "product line",
      pageLink: "/product_line",
    },
    {
      icon: <ManageAccountsIcon />,
      text: "accounts",
      pageLink: "/accounts",
    },
  ],
  [
    {
      icon: <DevicesIcon />,
      text: "product line",
      pageLink: "/product_line",
    },
    {
      icon: <InventoryIcon />,
      text: "package",
      pageLink: "/package_management",
    },
    {
      icon: <WarehouseIcon />,
      text: "warehouse",
      pageLink: "/warehouses",
    },
    {
      icon: <LocalShippingIcon />,
      text: "transport",
      pageLink: "/shipping",
    },
    {
      icon: <AssignmentIcon />,
      text: "request",
      pageLink: "/requests",
    },
  ],
  [
    {
      icon: <DevicesIcon />,
      text: "product line",
      pageLink: "/product_line",
    },
    {
      icon: <InventoryIcon />,
      text: "package",
      pageLink: "/package_management",
    },
    {
      icon: <PaidIcon />,
      text: "sold product",
      pageLink: "/products_sold",
    },
    {
      icon: <WarehouseIcon />,
      text: "warehouse",
      pageLink: "/warehouses",
    },
    {
      icon: <LocalShippingIcon />,
      text: "transport",
      pageLink: "/shipping",
    },
    {
      icon: <AssignmentIcon />,
      text: "request",
      pageLink: "/requests",
    },
  ],
  [
    {
      icon: <PrecisionManufacturingIcon />,
      text: "guarantee",
      pageLink: "/product_guarantee",
    },
    {
      icon: <WarehouseIcon />,
      text: "warehouse",
      pageLink: "/warehouses",
    },
    {
      icon: <LocalShippingIcon />,
      text: "transport",
      pageLink: "/shipping",
    },
    {
      icon: <AssignmentIcon />,
      text: "request",
      pageLink: "/requests",
    },
  ],
];

export default navbarMenuItems;

export const roles = [
  { roleValue: 1, text: "Admin" },
  { roleValue: 2, text: "Factory" },
  { roleValue: 3, text: "Agent" },
  { roleValue: 4, text: "Service Center" },
];

export const typeErrorCodeList = [
  "ERR-SC",
  "ERR-HE",
  "ERR-CH",
  "ERR-BA",
  "ERR-SP",
  "ERR-MA",
  "ERR-MI",
];

export const defineRoutesByRole = [
  ["/", "/product_line", "/accounts"],
  [
    "/",
    "/product_line",
    "/warehouses",
    "/error_products",
    "/product_line_packages",
    "/shipping",
    "/requests",
    "/package_management",
  ],
  [
    "/",
    "/product_line",
    "/warehouses",
    "/product_line_products",
    "/products_sold",
    "/shipping",
    "/requests",
    "/package_management",
  ],
  ["/", "/warehouses", "/product_guarantee", "/shipping", "/requests"],
];

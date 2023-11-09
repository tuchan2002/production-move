import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import COMMON_EN from "../locales/en/common.json";
import COMMON_JA from "../locales/ja/common.json";
import HOME_EN from "../locales/en/home.json";
import HOME_JA from "../locales/ja/home.json";
import NAVBAR_EN from "../locales/en/navbar.json";
import NAVBAR_JA from "../locales/ja/navbar.json";

const resources = {
  en: {
    common: COMMON_EN,
    home: HOME_EN,
    navbar: NAVBAR_EN,
  },
  ja: {
    common: COMMON_JA,
    home: HOME_JA,
    navbar: NAVBAR_JA,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  ns: ["common", "home", "navbar"],
  interpolation: {
    escapeValue: false,
  },
});

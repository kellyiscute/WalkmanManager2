import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const FirstLaunchPage: FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex-center w-full h-full">
      <h1 className="text-center">{t("welcome")}</h1>
      <p className="text-center">{t("welcome-guide")}</p>
      <Link replace to="/first-launch/setup"><Button variant="contained" endIcon={<ArrowForwardIcon />}>{t("get-started")}</Button></Link>
    </div>
  );
};

export default FirstLaunchPage;

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const FirstLaunchPage: FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex-center w-full h-full">
      <Typography variant="h3" className="text-center">
        {t("welcome")}
      </Typography>
      <Typography variant="subtitle1" className="text-center">
        {t("welcome-guide")}
      </Typography>
      <Link replace to="/first-launch/setup" className="mt-4">
        <Button variant="contained" endIcon={<ArrowForwardIcon />}>
          {t("get-started")}
        </Button>
      </Link>
    </div>
  );
};

export default FirstLaunchPage;

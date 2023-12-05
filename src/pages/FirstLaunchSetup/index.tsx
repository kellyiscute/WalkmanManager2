import { configContext } from "@/contexts/ConfigContextProvider";
import { NavigateNext } from "@mui/icons-material";
import { Button, Fab, TextField, Typography } from "@mui/material";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FirstLaunchSetupPage: FC = () => {
  const { t } = useTranslation("common");
  const { setLibraryPath, config } = useContext(configContext);
  const { libraryPath } = config;
  const navigate = useNavigate();

  async function browseLibraryPath() {
    const res = await window.api.selectDirectory();
    if (res) {
      setLibraryPath(res);
    }
  }

  function handleNext() {
    navigate("/");
  }

  return (
    <div className="flex-center w-full h-full">
      <Typography variant="h3">{t("setup-lib-path")}</Typography>
      <div className="flex mt-6" style={{ gap: "1rem" }}>
        <TextField
          variant="outlined"
          size="small"
          label={t("lib-path") ?? ""}
          value={libraryPath ?? ""}
          inputProps={{ readOnly: true }}
        />
        <Button variant="contained" onClick={browseLibraryPath}>
          {t("browse")}
        </Button>
      </div>
      <div className="absolute" style={{ bottom: "2rem", right: "3rem" }}>
        <Fab color="primary" variant="extended" disabled={!libraryPath} onClick={handleNext}>
          {t("finish")} <NavigateNext />
        </Fab>
      </div>
    </div>
  );
};

export default FirstLaunchSetupPage;

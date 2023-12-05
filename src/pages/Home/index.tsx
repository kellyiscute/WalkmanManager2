import BackgroundTaskIndicator from "@/components/BackgroundTaskIndicator";
import { configContext } from "@/contexts/ConfigContextProvider";
import { libraryContext } from "@/contexts/LibraryContextProvider";
import { Settings } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Tab, Tabs, Typography } from "@mui/material";
import { FC, useContext, useMemo } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const HomePage: FC = () => {
  const { config } = useContext(configContext);
  const { ready } = useContext(libraryContext);
  const location = useLocation();
  const currentPath = useMemo(() => location.pathname.split("/")[1], [location]);
  const navigate = useNavigate();

  if (!config.libraryPath) {
    return <Navigate to="/first-launch" replace={true} />;
  }

  if (currentPath === "") {
    return <Navigate to="/library" replace={true} />;
  }

  function gotoLibrary() {
    navigate("/library", { replace: true });
  }

  function gotoDevice() {
    navigate("/device", { replace: true });
  }

  if (!ready) {
    return (
      <div className="h-screen flex flex-col justify-center items-center flex-col">
        <Typography variant="h4">Updating Library...</Typography>
        <LinearProgress className="w-1/2 mt-6" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="absolute bottom-8 right-8">
        <BackgroundTaskIndicator />
      </div>
      <Box className="flex justify-between" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs className="flex-none" value={currentPath === "library" ? 0 : 1}>
          <Tab label="Library" onClick={gotoLibrary} />
          <Tab label="Device" onClick={gotoDevice} />
        </Tabs>
        <Box className="h-full aspect-square flex flex-none">
          <IconButton className="h-full aspect-square">
            <Settings />
          </IconButton>
        </Box>
      </Box>
      <div className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;

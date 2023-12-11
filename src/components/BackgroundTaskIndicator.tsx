import { backgroundTaskContext } from "@/contexts/BackgroundTaskContextProvider";
import { CircularProgress, Paper, Typography } from "@mui/material";
import { FC, useContext, useState } from "react";

const BackgroundTaskIndicator: FC = () => {
  const { taskList } = useContext(backgroundTaskContext);
  const [showText, setShowText] = useState(false);

  const handleMouseEnter = () => {
    setShowText(true);
  };

  const handleMouseLeave = () => {
    setShowText(false);
  };

  return (
    <Paper
      className="flex gap-4 p-4 overflow-hidden z-50"
      sx={{
        transition: "all 0.4s ease-in-out",
        width: showText ? "21rem" : "3.5rem",
        opacity: taskList.length ? 1 : 0,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CircularProgress size="1.5rem" className="flex-none" />
      <Typography
        variant="button"
        sx={{ whiteSpace: "nowrap", transition: "opacity 0.7s ease", opacity: showText ? 1 : 0 }}
      >
        {taskList.length > 1
          ? `${taskList.length} tasks running in background`
          : taskList[0]?.taskDescription}
      </Typography>
    </Paper>
  );
};

export default BackgroundTaskIndicator;

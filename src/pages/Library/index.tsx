import { Add } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import SongsView from "./SongsView";

const LibraryPage: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { t } = useTranslation("common");

  function selectAllMedia() {
    setSelectedIndex(-1);
  }

  const rows = [
    { id: 1, name: "Kelly is cute", artist: "Emily", path: "/home/kelly/music/1" },
    { id: 2, name: "Kelly is not cute", artist: "Cat", path: "/home/kelly/music/1" },
    { id: 3, name: "Is Kelly cute", artist: "Someone", path: "/home/kelly/music/1" },
    { id: 4, name: "Kelly is cute", artist: "Someone", path: "/home/kelly/music/1" },
    { id: 5, name: "Kelly is cute", artist: "", path: "/home/kelly/music/1" },
    { id: 6, name: "Kelly is cute", artist: "null", path: "/home/kelly/music/1" },
  ];

  return (
    <div className="h-full flex">
      <Box
        component="aside"
        sx={{ borderColor: "divider" }}
        className="flex-none h-full w-[250px] border-r"
      >
        <List>
          <ListSubheader>Your Library</ListSubheader>
          <ListItem disablePadding>
            <ListItemButton selected={selectedIndex === -1} onClick={selectAllMedia}>
              All Media
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListSubheader>
            <div className="flex justify-between align-center">
              <span>Playlists</span>
              <span>
                <IconButton className="aspect-square" size="small" style={{ flex: "none" }}>
                  <Add fontSize="small" />
                </IconButton>
              </span>
            </div>
          </ListSubheader>
          <Divider />
        </List>
      </Box>

      <Box className="flex-auto">
        <Box sx={{ display: "flex", alignItems: "flex-end", marginLeft: "15px" }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField id="input-with-sx" label={t("search")} variant="standard" />
        </Box>
        <SongsView SongsInfos={rows} />
      </Box>
    </div>
  );
};

export default LibraryPage;

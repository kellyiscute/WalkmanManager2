import { Add } from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { FC, useState } from "react";

const LibraryPage: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function selectAllMedia() {
    setSelectedIndex(-1);
  }

  return (
    <div className="h-full">
      <Box component="aside" sx={{ borderColor: "divider" }} className="flex-none h-full w-[250px] border-r">
        <List>
          <ListSubheader>Your Library</ListSubheader>
          <ListItem disablePadding>
            <ListItemButton selected={selectedIndex === -1} onClick={selectAllMedia}>All Media</ListItemButton>
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
        </List>
      </Box>
    </div>
  );
};

export default LibraryPage;

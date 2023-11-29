import { Add } from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListSubheader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

const LibraryPage: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { t } = useTranslation("common");

  function selectAllMedia() {
    setSelectedIndex(-1);
  }
  
  function createData (
    id: number,
    name: string,
    artist: string,
    path: string,
  ) {
    return { id, name, artist, path };
  }

  // TODO: fake data now
  const rows = [
    createData(1, "Kelly is cute", "Emily", "/home/kelly/music/1"),
    createData(2, "Kelly is not cute", "Cat", "/home/kelly/music/1"),
    createData(3, "Is Kelly cute", "Someone", "/home/kelly/music/1"),
    createData(4, "Kelly is cute", "Someone", "/home/kelly/music/1"),
    createData(5, "Kelly is cute", "", "/home/kelly/music/1"),
    createData(6, "Kelly is cute", "null", "/home/kelly/music/1"),
  ];

  return (
    <div className="h-full flex">
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
          <Divider />
        </List>
      </Box>

      <Box className="flex-auto">
        <Box sx={{ display: "flex", alignItems: "flex-end", marginLeft: "15px"}}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField id="input-with-sx" label={t("search")} variant="standard" />
        </Box>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">{t("storage-id")}</TableCell>
                <TableCell align="left">{t("name")}</TableCell>
                <TableCell align="left">{t("artist")}</TableCell>
                <TableCell align="left">{t("path")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => ( 
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.artist}</TableCell>
                  <TableCell align="left">{row.path}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


    </div>
  );
};

export default LibraryPage;

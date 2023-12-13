import {
  Box,
  TextField,
} from "@mui/material";
import { FC, useContext, useMemo, useState } from "react";
import SongsView from "./SongsView";
import { libraryContext } from "@/contexts/LibraryContextProvider";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import Fuse from "fuse.js";
import PlaylistView from "./PlaylistView";
import { Database } from "@/db/database";

const LibraryPage: FC = () => {
  const { songs: allSongs, songIdMap } = useContext(libraryContext);
  const { t } = useTranslation("common");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [songs, setSongs] = useState(allSongs);

  const fuse = useMemo(
    () => new Fuse(songs, { includeScore: true, keys: ["title", "album", "artist"] }),
    [songs],
  );

  const searchResult = useMemo(() => {
    if (searchKeyword === "") {
      return songs;
    }
    const res = fuse.search(searchKeyword);
    return res.map((item) => item.item);
  }, [searchKeyword, fuse]);

  async function handleSelectPlaylist(name?: string) {
    if (name) {
      const songsId = await Database.instance.getPlaylistSongs(name);
      setSongs(songsId.map((id) => songIdMap.get(id)!));
    } else {
      setSongs(allSongs);
    }
  }

  return (
    <Box className="h-full flex">
      <Box
        component="aside"
        sx={{ borderColor: "divider" }}
        className="relative flex-none h-full w-[250px] border-r"
      >
        <PlaylistView onPlaylistSelect={handleSelectPlaylist} />
      </Box>

      <Box className="flex-auto w-full flex flex-col">
        <Box className="flex items-center border-b pl-4" sx={{ borderColor: "grey.700" }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            value={searchKeyword}
            className="py-2"
            placeholder={t("search")}
            variant="standard"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Box>

        <Box className="flex-auto">
          <SongsView songs={searchResult} />
        </Box>
      </Box>
    </Box>
  );
};

export default LibraryPage;

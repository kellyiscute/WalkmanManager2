import { FC, PropsWithChildren, createContext, useState } from "react";
import _ from "lodash";

export interface ConfigData {
  libraryPath?: string;
}

export interface ConfigContextValue {
  config: ConfigData;
  setLibraryPath: (path: string) => void;
}

export const configContext = createContext<ConfigContextValue>({ config: {}, setLibraryPath: _.noop });

function loadConfig(): ConfigData {
  const libraryPath = localStorage.getItem("libraryPath");
  return { libraryPath: libraryPath ?? undefined };
}

const ConfigContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<ConfigData>(loadConfig());

  const setLibraryPath = (path: string) => {
    localStorage.setItem("libraryPath", path);
    setConfig({ ...config, libraryPath: path });
  };

  return (
    <configContext.Provider value={{ config, setLibraryPath }}>
      {children}
    </configContext.Provider>
  );
};

export default ConfigContextProvider;

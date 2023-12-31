import { RouterProvider, createMemoryRouter } from "react-router-dom";
import "./App.css";
import ConfigContextProvider from "./contexts/ConfigContextProvider";
import HomePage from "./pages/Home";
import FirstLaunchPage from "./pages/FirstLaunch";
import FirstLaunchSetupPage from "./pages/FirstLaunchSetup";
import LibraryPage from "./pages/Library";
import DevicePage from "./pages/Device";
import LibraryContextProvider from "./contexts/LibraryContextProvider";
import BackgroundTaskContextProvider from "./contexts/BackgroundTaskContextProvider";

const router = createMemoryRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/library",
        element: <LibraryPage />,
      },
      {
        path: "/device",
        element: <DevicePage />,
      },
    ],
  },
  {
    path: "/first-launch",
    element: <FirstLaunchPage />,
  },
  {
    path: "/first-launch/setup",
    element: <FirstLaunchSetupPage />,
  },
]);

function App() {
  return (
    <ConfigContextProvider>
      <LibraryContextProvider>
        <BackgroundTaskContextProvider>
          <RouterProvider router={router} />
        </BackgroundTaskContextProvider>
      </LibraryContextProvider>
    </ConfigContextProvider>
  );
}

export default App;

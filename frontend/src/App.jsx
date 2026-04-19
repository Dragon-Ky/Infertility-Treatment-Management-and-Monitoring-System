import AllRoutes from "./components/AllRoutes";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "./contexts/ProfileContext";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ProfileProvider>
        <AllRoutes />
      </ProfileProvider>
    </>
  );
}

export default App;

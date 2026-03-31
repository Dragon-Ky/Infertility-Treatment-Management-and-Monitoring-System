import AllRoutes from "./components/AllRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AllRoutes />
    </>
  );
}

export default App;

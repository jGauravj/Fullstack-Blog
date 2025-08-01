import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/signin" element={<h1>Sign in Page</h1>} />
          <Route path="/signup" element={<h1>Sign up Page</h1>} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

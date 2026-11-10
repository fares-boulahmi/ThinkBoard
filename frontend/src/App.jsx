import { Route, Routes } from "react-router";
import NavBar from "./Components/NavBar";
import CreatePage from "./Pages/CreatePage";
import HomePage from "./Pages/HomePage";
import NoteDetailPage from "./Pages/NoteDetailPage";

const App = () => {
  return (
    <div data-theme="cupcake" className="min-h-screen bg-base-100 bg-gray-300">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Container from "./components/layout/Container";
import Dashboard from "./pages/Dashboard";
import DeletedHistory from "./pages/DeletedHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deleted" element={<DeletedHistory />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

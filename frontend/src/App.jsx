import './App.css';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import { Routes, Route } from "react-router-dom"; // ✅ Import Routes too
import Land from './pages/Land';
import LandForm from './pages/LandForm';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes> 
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/land" element={<Land />} />
        <Route path="/land/form" element={<LandForm />} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;

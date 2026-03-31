import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleNew from './pages/VehicleNew';
import VehicleDetails from './pages/VehicleDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <nav className="navbar">
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated && <Link to="/vehicle/new">Register New Vehicle</Link>}
        {!isAuthenticated ? <Link to="/login">Login</Link> : <button onClick={logout}>Logout</button>}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle/new"
            element={
              <ProtectedRoute>
                <VehicleNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle/:id"
            element={
              <ProtectedRoute>
                <VehicleDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

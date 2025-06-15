import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Breadcrumb from './components/layout/Breadcrumb';
import ClientList from './components/clients/ClientList';
import DevisList from './components/devis/DevisList';
import Dashboard from './pages/Dashboard'; 
import './components/layout/navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Layout>
        <Breadcrumb />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/devis" element={<DevisList />} />
          <Route path="/analytics" element={<div className="container mt-4"><h2>Analytics (À venir)</h2></div>} />
        </Routes>
        
        {/* Notifications Toast */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Layout>
    </Router>
  );
}

export default App;
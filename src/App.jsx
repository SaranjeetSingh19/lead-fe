import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AllLeads from './pages/AllLeads';
import WebsiteLeads from './pages/WebsiteLeads';
import MetaLeads from './pages/MetaLeads';
import InstagramLeads from './pages/InstagramLeads';
import GoogleLeads from './pages/GoogleLeads';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/all-leads" element={<AllLeads />} />
          <Route path="/website-leads" element={<WebsiteLeads />} />
          <Route path="/meta-leads" element={<MetaLeads />} />
          <Route path="/instagram-leads" element={<InstagramLeads />} />
          <Route path="/google-leads" element={<GoogleLeads />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
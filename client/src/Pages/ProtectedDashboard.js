import RequireAuth from '../Components/RequireAuth.js';
import Dashboard from '../Components/Home.jsx';

const ProtectedDashboard = RequireAuth(Dashboard);

export default ProtectedDashboard;

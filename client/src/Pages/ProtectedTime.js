import RequireAuth from '../Components/RequireAuth.js';
import Time from '../Components/timeTracking.jsx';

const ProtectedTime = RequireAuth(Time);

export default ProtectedTime;

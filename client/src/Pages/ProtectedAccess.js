import RequireAuth from '../Components/RequireAuth.js';
import Access from '../Components/Access.jsx';

const ProtectedTime = RequireAuth(Access);

export default ProtectedAccess;
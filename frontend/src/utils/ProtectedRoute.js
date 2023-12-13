import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({Component}) => {
    const isAuth = localStorage.getItem('isAuth')

    return isAuth ? <Component /> : <Navigate to="/signin" />
}

export default ProtectedRoute


import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth';
import Superuser from './pages/superuser/Superuser';
import Admin from './pages/admin/Admin';
import { useEffect } from 'react';
import apiClient from './lib/apiClient.js';
import { GET_USER_INFO, TEST } from './utils/constants.js';
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from './redux/features/userSlice.js';
import Verify from './pages/auth/Verify';
import User from './pages/user/User';

const AuthRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;
  if (isAuthenticated) {
    if (user.role === 'superuser') {
      return <Navigate to='/superuser' />
    } else if (user.role === 'admin') {
      return user.isVerified ? <Navigate to='/admin' /> : <Navigate to='/verify' />
    } else if (user.role === 'user') {
      return user.isVerified ? <Navigate to='/user' /> : <Navigate to='/verify' />
    }
  } else {
    return <>{children}</>
  }
}

const SuperuserRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)

  const isAuthenticated = !!user && user.role === 'superuser'
  return isAuthenticated ? <>{children}</> : <Navigate to='/auth' />
}

const VerifyRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  const isAuthenticated = !!user
  if (isAuthenticated && user.isVerified) {
    if (user.role === 'admin')
      return <Admin />
    else if (user.role === 'user')
      return <User />
  } else {
    return isAuthenticated ? <>{children}</> : <Navigate to='/auth' />
  }
}


const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  const isAuthenticated = !!user && user.role === 'user' && user.isVerified
  return isAuthenticated ? <>{children}</> : <Navigate to='/auth' />
}


function App() {
  const dispatch = useDispatch()

  const getUserByToken = async () => {
    try {
      const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
      if (response.data.user) {
        console.log(response.data.user)
        dispatch(setUser(response.data.user))
      } else {
        dispatch(setUser(null))
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getUserByToken()
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Navigate to='/auth' />} />


          <Route
            path='/auth'
            element={
              <AuthRoute >
                <Auth />
              </AuthRoute >
            }
          />

          <Route
            path='/verify'
            element={
              <VerifyRoute >
                <Verify />
              </VerifyRoute >
            }
          />

          <Route
            path='/superuser'
            element={
              <SuperuserRoute >
                <Superuser />
              </SuperuserRoute >
            }
          />

          <Route
            path='/admin'
            element={
              <VerifyRoute >
                <Admin />
              </VerifyRoute >
            }
          />


          <Route
            path='/user'
            element={
              <UserRoute >
                <User />
              </UserRoute >
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

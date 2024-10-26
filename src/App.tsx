import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MyWork } from './pages/MyWork';
import { NewEstimate } from './pages/NewEstimate';
import { EstimateDetails } from './pages/EstimateDetails';
import { Users } from './pages/Users';
import { AddUser } from './pages/AddUser';
import { UserProfile } from './pages/UserProfile';
import { Settings } from './pages/Settings';
import { BodyShops } from './pages/BodyShops';
import { BodyShopDetails } from './pages/BodyShopDetails';
import { useStore } from './store/useStore';

function App() {
  const { isAuthenticated } = useStore();

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 overflow-y-auto ${isAuthenticated ? 'p-8' : 'p-0'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/my-work" element={
              <PrivateRoute>
                <MyWork />
              </PrivateRoute>
            } />
            
            <Route path="/new-estimate" element={
              <PrivateRoute>
                <NewEstimate />
              </PrivateRoute>
            } />
            
            <Route path="/estimates/:id" element={
              <PrivateRoute>
                <EstimateDetails />
              </PrivateRoute>
            } />
            
            <Route path="/users" element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } />
            
            <Route path="/users/add" element={
              <PrivateRoute>
                <AddUser />
              </PrivateRoute>
            } />
            
            <Route path="/users/:id" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
            
            <Route path="/body-shops" element={
              <PrivateRoute>
                <BodyShops />
              </PrivateRoute>
            } />
            
            <Route path="/body-shops/:id" element={
              <PrivateRoute>
                <BodyShopDetails />
              </PrivateRoute>
            } />
            
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
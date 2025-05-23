import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Pages
import WelcomeScreen from './pages/WelcomeScreen';
import CityView from './pages/CityView';
import BuildingDetail from './pages/BuildingDetail';
import RiskEvent from './pages/RiskEvent';
import RewardScreen from './pages/RewardScreen';
import DailyWheel from './pages/DailyWheel';
import StoryChapter from './pages/StoryChapter';
import SocialRaid from './pages/SocialRaid';
import TokenShop from './pages/TokenShop';
import UserProfile from './pages/UserProfile';

// Components
import Navigation from './components/Navigation';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  position: relative;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  // Simulate loading initial data
  useEffect(() => {
    const loadUserData = () => {
      // Check if user data exists in localStorage
      const savedData = localStorage.getItem('energogorod_user');
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          initializeNewUser();
        }
      } else {
        initializeNewUser();
      }
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    
    const initializeNewUser = () => {
      // Create default user data for new users
      const newUserData = {
        level: 1,
        energy: 100,
        tokens: 50,
        buildings: [
          { id: 'house', level: 1, position: { x: 3, y: 3 }, protected: false },
          { id: 'car', level: 1, position: { x: 3, y: 4 }, protected: false },
          { id: 'sportcenter', level: 1, position: { x: 5, y: 3 }, protected: false },
          { id: 'airport', level: 1, position: { x: 4, y: 5 }, protected: false },
        ],
        completedEvents: [],
        inventory: [],
        story: { currentChapter: 1, completedChapters: [] },
      };
      
      setUserData(newUserData);
      localStorage.setItem('energogorod_user', JSON.stringify(newUserData));
    };
    
    loadUserData();
  }, []);
  
  // Save user data whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('energogorod_user', JSON.stringify(userData));
    }
  }, [userData]);
  
  // Handle user progress updates
  const updateUserData = (newData) => {
    setUserData(prevData => ({
      ...prevData,
      ...newData
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '100vh' }}>
        <div className="animate-pulse">
          <h1>ЭнергоГород</h1>
          <p>Загрузка вашего города...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContainer>
      <Main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route 
              path="/city" 
              element={
                <CityView 
                  userData={userData} 
                  updateUserData={updateUserData} 
                />
              } 
            />
            <Route 
              path="/building/:id" 
              element={
                <BuildingDetail 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/event/:id" 
              element={
                <RiskEvent 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/reward/:type" 
              element={
                <RewardScreen 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/wheel" 
              element={
                <DailyWheel 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/story/:chapter" 
              element={
                <StoryChapter 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/social/raid" 
              element={
                <SocialRaid 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/shop" 
              element={
                <TokenShop 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <UserProfile 
                  userData={userData} 
                  updateUserData={updateUserData}
                />
              } 
            />
          </Routes>
        </AnimatePresence>
      </Main>
      
      {/* Only show navigation on pages that need it */}
      {window.location.pathname !== '/' && (
        <Navigation userData={userData} />
      )}
    </AppContainer>
  );
}

export default App;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components for the welcome screen
const WelcomeContainer = styled(motion.div)`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #340924 0%, #8e1d41 100%);
  color: white;
  position: relative;
  overflow: hidden;
  padding: 0 var(--spacing-lg);
  text-align: center;
`;

const LogoWrapper = styled(motion.div)`
  margin-bottom: var(--spacing-xl);
`;

const Logo = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--spacing-md);
`;

const Slogan = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  font-weight: 500;
  opacity: 0.9;
`;

const EnterButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.1rem;
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

// Background animated elements
const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
`;

const Skyline = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20vh;
  background: rgba(0, 0, 0, 0.5);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cpath d='M0,200 L0,140 L40,140 L40,100 L60,100 L60,120 L80,120 L80,80 L100,80 L100,60 L120,60 L120,80 L140,80 L140,100 L160,100 L160,60 L180,60 L180,40 L200,40 L200,60 L220,60 L220,80 L240,80 L240,100 L260,100 L260,120 L280,120 L280,80 L300,80 L300,60 L320,60 L320,40 L340,40 L340,60 L360,60 L360,100 L380,100 L380,140 L400,140 L400,120 L420,120 L420,100 L440,100 L440,80 L460,80 L460,100 L480,100 L480,60 L500,60 L500,40 L520,40 L520,60 L540,60 L540,80 L560,80 L560,120 L580,120 L580,140 L600,140 L600,120 L620,120 L620,100 L640,100 L640,80 L660,80 L660,60 L680,60 L680,80 L700,80 L700,100 L720,100 L720,140 L740,140 L740,120 L760,120 L760,80 L780,80 L780,60 L800,60 L800,40 L820,40 L820,60 L840,60 L840,100 L860,100 L860,120 L880,120 L880,140 L900,140 L900,160 L920,160 L920,120 L940,120 L940,100 L960,100 L960,120 L980,120 L980,140 L1000,140 L1000,200 Z' fill='%23000'/%3E%3C/svg%3E");
  mask-size: cover;
  mask-repeat: no-repeat;
`;

const Star = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
`;

const Cloud = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Create stars randomly positioned
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 70}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.opacity = Math.random();
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    }
    
    // Create clouds
    const cloudsContainer = document.getElementById('clouds-container');
    if (cloudsContainer) {
      for (let i = 0; i < 6; i++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.style.top = `${Math.random() * 60 + 10}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.width = `${Math.random() * 200 + 50}px`;
        cloud.style.height = `${cloud.style.width * 0.6}px`;
        cloud.style.opacity = Math.random() * 0.3 + 0.1;
        cloud.style.animationDuration = `${Math.random() * 100 + 50}s`;
        cloudsContainer.appendChild(cloud);
      }
    }
  }, []);
  
  const handleEnterClick = () => {
    navigate('/city');
  };

  return (
    <WelcomeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedBackground>
        <div id="stars-container"></div>
        <div id="clouds-container"></div>
        <Skyline 
          initial={{ y: 20, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </AnimatedBackground>
      
      <ContentWrapper>
        <LogoWrapper
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Logo>ЭНЕРГОГОРОД</Logo>
        </LogoWrapper>
        
        <Slogan
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Защитим то, что для вас важно
        </Slogan>
        
        <EnterButton
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnterClick}
        >
          Войти и построить свой город
        </EnterButton>
      </ContentWrapper>
      
      <style jsx="true">{`
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        
        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: drift linear infinite;
        }
        
        @keyframes drift {
          from { transform: translateX(0); }
          to { transform: translateX(-100vw); }
        }
      `}</style>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;

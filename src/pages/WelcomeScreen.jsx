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
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(142, 29, 65, 0), rgba(0, 0, 0, 0.4));
    z-index: 0;
  }
`;

const LogoWrapper = styled(motion.div)`
  margin-bottom: var(--spacing-xl);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: -1;
  }
`;

const Logo = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  margin-bottom: var(--spacing-md);
  background: linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Slogan = styled(motion.p)`
  font-size: 1.35rem;
  margin-bottom: var(--spacing-xl);
  font-weight: 500;
  opacity: 0.9;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const EnterButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.1rem;
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-full);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: var(--border-radius-full);
    background: linear-gradient(60deg, var(--color-primary) 0%, white 30%, white 70%, var(--color-primary) 100%);
    z-index: -1;
    animation: borderRotate 4s linear infinite;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @keyframes borderRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
  height: 25vh;
  background: rgba(0, 0, 0, 0.6);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cpath d='M0,200 L0,140 L40,140 L40,100 L60,100 L60,120 L80,120 L80,80 L100,80 L100,60 L120,60 L120,80 L140,80 L140,100 L160,100 L160,60 L180,60 L180,40 L200,40 L200,60 L220,60 L220,80 L240,80 L240,100 L260,100 L260,120 L280,120 L280,80 L300,80 L300,60 L320,60 L320,40 L340,40 L340,60 L360,60 L360,100 L380,100 L380,140 L400,140 L400,120 L420,120 L420,100 L440,100 L440,80 L460,80 L460,100 L480,100 L480,60 L500,60 L500,40 L520,40 L520,60 L540,60 L540,80 L560,80 L560,120 L580,120 L580,140 L600,140 L600,120 L620,120 L620,100 L640,100 L640,80 L660,80 L660,60 L680,60 L680,80 L700,80 L700,100 L720,100 L720,140 L740,140 L740,120 L760,120 L760,80 L780,80 L780,60 L800,60 L800,40 L820,40 L820,60 L840,60 L840,100 L860,100 L860,120 L880,120 L880,140 L900,140 L900,160 L920,160 L920,120 L940,120 L940,100 L960,100 L960,120 L980,120 L980,140 L1000,140 L1000,200 Z' fill='%23000'/%3E%3C/svg%3E");
  mask-size: cover;
  mask-repeat: no-repeat;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, rgba(142, 29, 65, 0.3), rgba(142, 29, 65, 0));
  }
`;

const Star = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px white;
`;

const Cloud = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(5px);
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EnergoLogo = styled(motion.div)`
  margin-bottom: var(--spacing-lg);
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "E";
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-primary);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
    animation: rotate 8s linear infinite;
  }
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Create stars with twinkling effect
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
      starsContainer.innerHTML = ''; // Clear any previous stars
      
      // Create several layers of stars for parallax effect
      const createStarLayer = (count, size, speed, opacity, blur) => {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < count; i++) {
          const star = document.createElement('div');
          star.classList.add('star');
          star.style.top = `${Math.random() * 80}%`;
          star.style.left = `${Math.random() * 100}%`;
          
          // Randomize size slightly within the given range
          const actualSize = size * (0.8 + Math.random() * 0.4);
          star.style.width = `${actualSize}px`;
          star.style.height = `${actualSize}px`;
          
          // Apply properties
          star.style.opacity = opacity;
          star.style.filter = blur ? `blur(${blur}px)` : '';
          star.style.animationDelay = `${Math.random() * 5}s`;
          star.style.animationDuration = `${speed + Math.random() * 2}s`;
          
          // Some stars can have different colors
          if (Math.random() > 0.8) {
            star.style.boxShadow = `0 0 ${actualSize * 2}px rgba(255, 255, 255, 0.8)`;
            star.style.background = `rgba(${180+Math.random()*75}, ${180+Math.random()*75}, 255, ${opacity})`;
          } else {
            star.style.boxShadow = `0 0 ${actualSize}px rgba(255, 255, 255, 0.5)`;
          }
          
          fragment.appendChild(star);
        }
        
        return fragment;
      };
      
      // Create 3 layers of stars with different properties
      starsContainer.appendChild(createStarLayer(30, 1, 3, 0.7, 0)); // Small stars
      starsContainer.appendChild(createStarLayer(20, 2, 4, 0.9, 0)); // Medium stars
      starsContainer.appendChild(createStarLayer(10, 3, 5, 1, 0.5)); // Large stars with glow
    }
    
    // Create clouds with better aesthetics
    const cloudsContainer = document.getElementById('clouds-container');
    if (cloudsContainer) {
      cloudsContainer.innerHTML = ''; // Clear any previous clouds
      
      for (let i = 0; i < 8; i++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        
        // Position clouds at different heights
        cloud.style.top = `${Math.random() * 60 + 5}%`;
        cloud.style.left = `${Math.random() * 120}%`; // Some start off-screen
        
        // Size varies by position (clouds higher up are smaller)
        const topPercent = parseInt(cloud.style.top) / 100;
        const sizeMultiplier = 1 - (topPercent * 0.5); // Higher clouds are smaller
        cloud.style.width = `${(Math.random() * 200 + 100) * sizeMultiplier}px`;
        cloud.style.height = `${parseInt(cloud.style.width) * 0.5}px`;
        
        // Transparency based on height
        cloud.style.opacity = Math.random() * 0.2 + 0.05;
        
        // Speed based on size (larger clouds move slower)
        const speed = parseInt(cloud.style.width) / 2 + 80;
        cloud.style.animationDuration = `${speed}s`;
        
        // Add some variation in clouds
        if (Math.random() > 0.5) {
          cloud.style.filter = `blur(${Math.random() * 5 + 5}px)`;
        } else {
          cloud.style.filter = `blur(${Math.random() * 3 + 3}px)`;
        }
        
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
      transition={{ duration: 0.8 }}
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
        <EnergoLogo
          initial={{ y: 30, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.2, 
            duration: 1,
            type: "spring",
            stiffness: 200
          }}
        />
        
        <LogoWrapper
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Logo>ЭНЕРГОГОРОД</Logo>
        </LogoWrapper>
        
        <Slogan
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Защитим то, что для вас важно
        </Slogan>
        
        <EnterButton
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          whileHover={{ scale: 1.05, y: -5 }}
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
          animation: twinkle infinite ease-in-out;
          z-index: 1;
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.3; 
            transform: scale(0.8);
          }
        }
        
        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: drift linear infinite;
          z-index: 2;
        }
        
        @keyframes drift {
          from { transform: translateX(0); }
          to { transform: translateX(-120vw); }
        }
        
        /* Shooting stars */
        @keyframes shootingStars {
          0% {
            opacity: 0;
            transform: translate(-100px, -100px) rotate(45deg);
          }
          10%, 15% {
            opacity: 1;
          }
          20% {
            opacity: 0;
            transform: translate(100vw, 100vh) rotate(45deg);
          }
          100% {
            opacity: 0;
          }
        }
        
        /* Periodically add shooting stars */
        #stars-container::after {
          content: "";
          position: absolute;
          top: 10%;
          left: 10%;
          width: 100px;
          height: 1px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
          box-shadow: 0 0 4px white;
          transform-origin: center;
          animation: shootingStars 8s linear infinite;
          animation-delay: 2s;
        }
        
        #stars-container::before {
          content: "";
          position: absolute;
          top: 30%;
          left: 50%;
          width: 150px;
          height: 2px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
          box-shadow: 0 0 5px white;
          transform-origin: center;
          animation: shootingStars 12s linear infinite;
          animation-delay: 5s;
        }
      `}</style>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;

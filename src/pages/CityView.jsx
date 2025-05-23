import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for buildings
const buildingTypes = {
  house: {
    name: 'Дом',
    description: 'Ваше уютное жилище',
    risks: ['fire', 'flood', 'theft'],
    levels: [
      { cost: 0, energyCost: 0, description: 'Базовый дом' },
      { cost: 20, energyCost: 10, description: 'Улучшенный дом с садом' },
      { cost: 50, energyCost: 30, description: 'Роскошный особняк' },
    ]
  },
  car: {
    name: 'Автомобиль',
    description: 'Ваш личный транспорт',
    risks: ['accident', 'theft', 'damage'],
    levels: [
      { cost: 0, energyCost: 0, description: 'Базовый автомобиль' },
      { cost: 15, energyCost: 10, description: 'Комфортный седан' },
      { cost: 40, energyCost: 25, description: 'Премиум-класс' },
    ]
  },
  sportcenter: {
    name: 'Спортцентр',
    description: 'Место для активного отдыха',
    risks: ['injury', 'fire', 'liability'],
    levels: [
      { cost: 0, energyCost: 0, description: 'Базовый спортзал' },
      { cost: 25, energyCost: 15, description: 'Многофункциональный фитнес-центр' },
      { cost: 45, energyCost: 30, description: 'Премиум спорткомплекс' },
    ]
  },
  airport: {
    name: 'Аэропорт',
    description: 'Связь с миром',
    risks: ['delay', 'cancellation', 'baggage'],
    levels: [
      { cost: 0, energyCost: 0, description: 'Маленький аэродром' },
      { cost: 30, energyCost: 20, description: 'Региональный аэропорт' },
      { cost: 60, energyCost: 40, description: 'Международный аэрохаб' },
    ]
  }
};

// Styled components
const CityViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--color-sky);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/src/assets/images/city-bg.svg');
    background-size: cover;
    background-position: bottom center;
    opacity: 0.6;
    z-index: 0;
    pointer-events: none;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--glass-background);
  backdrop-filter: var(--glass-blur);
  border-bottom: var(--glass-border);
  z-index: 10;
  box-shadow: var(--shadow-md);
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    right: -20px;
    width: 1px;
    height: 70%;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(rgba(255, 255, 255, 0.3), transparent);
    transform: rotate(45deg);
    animation: shimmerEffect 2s infinite;
    pointer-events: none;
  }
  
  @keyframes shimmerEffect {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const Level = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: "⭐";
    font-size: 0.8rem;
  }
`;

const EnergyBar = styled.div`
  height: 8px;
  width: 100px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-inner);
  
  &::before {
    content: "Энергия";
    position: absolute;
    font-size: 0.6rem;
    color: var(--color-text-light);
    bottom: -14px;
    left: 0;
  }
`;

const EnergyFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  border-radius: var(--border-radius-full);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    opacity: 0.7;
    animation: pulse 2s infinite;
  }
`;

const TokensInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const TokenCount = styled.div`
  font-weight: 600;
  background: var(--glass-background);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  color: var(--color-text);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const TokenIcon = styled.span`
  font-size: 1.2rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: "";
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0) 70%);
    z-index: -1;
    animation: glow 2s infinite;
  }
  
  @keyframes glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(rgba(255, 255, 255, 0.3), transparent);
    transform: rotate(45deg);
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    animation: shimmerAdd 1s forwards;
  }
  
  @keyframes shimmerAdd {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }
`;

const CityGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  perspective: 1200px;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
  padding: var(--spacing-xl);
  z-index: 1;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0) 30%,
      rgba(142, 29, 65, 0.05) 70%
    );
    pointer-events: none;
    z-index: -1;
  }
`;

const GridCell = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  
  &::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 10%;
    right: 10%;
    bottom: 10%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--border-radius-md);
    opacity: 0.3;
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.05);
    z-index: 10;
    
    &::before {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
`;

const CellContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transform-style: preserve-3d;
  transform: ${props => props.hasBuilding ? 'scale(1.1)' : 'scale(0.9)'};
  transition: transform 0.3s ease;
  
  ${props => props.hasBuilding && `
    &::before {
      content: "";
      position: absolute;
      width: 70%;
      height: 20%;
      bottom: 10%;
      background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 80%);
      border-radius: 50%;
      filter: blur(3px);
      z-index: -1;
    }
  `}
`;

const BuildingGraphic = styled.div`
  width: 80%;
  height: 80%;
  background: ${props => props.protected 
    ? 'linear-gradient(to bottom, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))'
    : 'transparent'};
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--color-primary);
  position: relative;
  transition: all 0.3s ease;
  
  ${props => props.protected && `
    &::before {
      content: "";
      position: absolute;
      inset: -4px;
      border: 2px solid rgba(76, 175, 80, 0.5);
      border-radius: var(--border-radius-lg);
      background: transparent;
      box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
      animation: pulseProtection 2s infinite;
      z-index: -1;
    }
    
    @keyframes pulseProtection {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.05); }
    }
  `}
  
  ${props => props.level > 1 && `
    box-shadow: 0 15px 25px rgba(0,0,0,0.15);
    transform: translateY(-5px);
  `}

  &::after {
    content: "${props => props.level > 1 ? '⭐'.repeat(props.level) : ''}";
    position: absolute;
    bottom: -10px;
    font-size: 0.8rem;
    line-height: 1;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
  }
  
  /* Add a subtle bounce animation when hovered */
  ${GridCell}:hover & {
    animation: buildingBounce 0.5s;
  }
  
  @keyframes buildingBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;

const FogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  
  &::before, &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 40%;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
    animation: fogPulse 10s infinite ease-in-out;
  }
  
  &::before {
    top: 0;
    transform: translateY(-30%) scale(1.2);
  }
  
  &::after {
    bottom: 0;
    transform: translateY(30%) scale(1.2) rotate(180deg);
  }
  
  @keyframes fogPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
`;

const EventIndicator = styled(motion.div)`
  position: absolute;
  top: 5%;
  right: 5%;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(244, 67, 54, 0.6);
  z-index: 5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid rgba(244, 67, 54, 0.5);
    animation: pingPong 1.5s infinite;
  }
  
  @keyframes pingPong {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
`;

const DailyWheelButton = styled(motion.button)`
  position: fixed;
  bottom: 90px;
  right: 25px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ad3559 0%, #8e1d41 100%);
  color: white;
  font-size: 1.8rem;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(142, 29, 65, 0.2);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  
  /* Create a subtle shine/reflection */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(to bottom right, rgba(255,255,255,0.4), transparent);
    transform: rotate(45deg);
    z-index: 1;
    transition: all 0.5s ease;
  }
  
  /* Notification badge */
  &::after {
    content: "1";
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #ff5252 0%, #f44336 100%);
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: bold;
    border: 3px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 2;
    animation: pulse 2s infinite;
  }
  
  /* Inner text for the wheel icon */
  span {
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  /* Animation for the badge */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  &:hover {
    transform: scale(1.1) translateY(-5px) rotate(5deg);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35), 0 0 0 4px rgba(142, 29, 65, 0.3);
    
    &::before {
      animation: spinReflection 1s forwards;
    }
  }
  
  @keyframes spinReflection {
    from { transform: translateX(-120%) rotate(45deg); }
    to { transform: translateX(120%) rotate(45deg); }
  }
`;

// Building emojis for visual representation
const buildingEmojis = {
  house: '🏠',
  car: '🚗',
  sportcenter: '🏋️',
  airport: '✈️'
};

// Random risk event generation
const generateRandomEvent = (building) => {
  if (!building) return null;
  
  const buildingInfo = buildingTypes[building.id];
  const randomRisk = buildingInfo.risks[Math.floor(Math.random() * buildingInfo.risks.length)];
  
  return {
    buildingId: building.id,
    risk: randomRisk,
    position: building.position
  };
};

const CityView = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [activeEvent, setActiveEvent] = useState(null);
  
  // Generate grid cells (8x8 grid)
  const gridCells = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const position = { x: col, y: row };
      // Find if there's a building at this position
      const building = userData.buildings.find(
        b => b.position.x === col && b.position.y === row
      );
      
      gridCells.push({ position, building });
    }
  }
  
  // Simulate risk events periodically
  useEffect(() => {
    // Choose a random building for a risk event
    const triggerRandomEvent = () => {
      // Only generate events if none are active
      if (!activeEvent && Math.random() > 0.3) { // 70% chance of an event
        const randomBuildingIndex = Math.floor(Math.random() * userData.buildings.length);
        const targetBuilding = userData.buildings[randomBuildingIndex];
        const event = generateRandomEvent(targetBuilding);
        setActiveEvent(event);
      }
    };
    
    // Set up intervals for random events
    const eventInterval = setInterval(triggerRandomEvent, 30000); // Every 30 seconds
    
    // Mock a first event after 5 seconds for demo purposes
    const initialEventTimer = setTimeout(() => {
      const firstBuilding = userData.buildings.find(b => b.id === 'car');
      const event = generateRandomEvent(firstBuilding);
      setActiveEvent(event);
    }, 5000);
    
    return () => {
      clearInterval(eventInterval);
      clearTimeout(initialEventTimer);
    };
  }, [userData.buildings, activeEvent]);
  
  const handleCellClick = (cell) => {
    if (cell.building) {
      if (activeEvent && activeEvent.buildingId === cell.building.id) {
        // Navigate to risk event if this building has an active event
        navigate(`/event/${cell.building.id}`);
      } else {
        // Otherwise navigate to building detail
        navigate(`/building/${cell.building.id}`);
      }
    }
  };
  
  const handleDailyWheelClick = () => {
    navigate('/wheel');
  };
  
  const handleShopClick = () => {
    navigate('/shop');
  };
  
  return (
    <CityViewContainer>
      <TopBar>
        <UserInfo>
          <Avatar>{userData.level}</Avatar>
          <LevelInfo>
            <Level>Уровень {userData.level}</Level>
            <EnergyBar>
              <EnergyFill percentage={(userData.energy / 100) * 100} />
            </EnergyBar>
          </LevelInfo>
        </UserInfo>
        
        <TokensInfo>
          <TokenCount>
            <TokenIcon>💎</TokenIcon>
            {userData.tokens}
          </TokenCount>
          <AddButton onClick={handleShopClick}>+</AddButton>
        </TokensInfo>
      </TopBar>
      
      <CityGrid>
        {gridCells.map((cell, index) => (
          <GridCell 
            key={index} 
            onClick={() => handleCellClick(cell)}
          >
            <CellContent hasBuilding={cell.building}>
              {cell.building && (
                <BuildingGraphic 
                  protected={cell.building.protected}
                  level={cell.building.level}
                >
                  {buildingEmojis[cell.building.id]}
                  {activeEvent && activeEvent.buildingId === cell.building.id && (
                    <EventIndicator
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "mirror"
                      }}
                    >
                      !
                    </EventIndicator>
                  )}
                </BuildingGraphic>
              )}
            </CellContent>
          </GridCell>
        ))}
      </CityGrid>
      
      <FogOverlay />
      
      <DailyWheelButton
        onClick={handleDailyWheelClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <span>🎡</span>
      </DailyWheelButton>
    </CityViewContainer>
  );
};

export default CityView;

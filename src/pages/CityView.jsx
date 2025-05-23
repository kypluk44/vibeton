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
  background: linear-gradient(180deg, #a7d8ff 0%, #eaf6ff 100%);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Level = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const EnergyBar = styled.div`
  height: 6px;
  width: 80px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

const EnergyFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: var(--color-primary);
  border-radius: 3px;
`;

const TokensInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const TokenCount = styled.div`
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TokenIcon = styled.span`
  color: var(--color-primary);
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 1.2rem;
  line-height: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary-light);
    transform: translateY(-2px);
  }
`;

const CityGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  perspective: 1000px;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
  padding: var(--spacing-lg);
`;

const GridCell = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    z-index: 2;
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
`;

const BuildingGraphic = styled.div`
  width: 80%;
  height: 80%;
  background-color: ${props => props.protected ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  border: ${props => props.protected ? '2px solid rgba(76, 175, 80, 0.5)' : 'none'};
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--color-primary);
  box-shadow: ${props => props.level > 1 ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'};
  position: relative;

  &::after {
    content: "${props => props.level > 1 ? '⭐'.repeat(props.level) : ''}";
    position: absolute;
    bottom: -5px;
    font-size: 0.7rem;
    line-height: 1;
  }
`;

const FogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before, &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 30%;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    bottom: 0;
    transform: rotate(180deg);
  }
`;

const EventIndicator = styled(motion.div)`
  position: absolute;
  top: 10%;
  right: 10%;
  background: var(--color-danger);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.7rem;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
  z-index: 5;
`;

const DailyWheelButton = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 1.5rem;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  
  &::after {
    content: "1";
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--color-danger);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: bold;
    border: 2px solid white;
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
        🎡
      </DailyWheelButton>
    </CityViewContainer>
  );
};

export default CityView;

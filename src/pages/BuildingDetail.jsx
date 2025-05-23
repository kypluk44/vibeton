import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for buildings (same as in CityView)
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

// Mock data for insurance policies
const insurancePolicies = {
  house: [
    { id: 'home-basic', name: 'Базовая защита дома', description: 'Защита от пожара и затопления', cost: 10, discount: 0 },
    { id: 'home-premium', name: 'Премиум защита дома', description: 'Полная защита имущества включая кражу', cost: 25, discount: 0 },
  ],
  car: [
    { id: 'car-osago', name: 'ОСАГО', description: 'Базовая защита автомобиля', cost: 8, discount: 5 },
    { id: 'car-kasko', name: 'КАСКО', description: 'Полная защита от всех рисков', cost: 20, discount: 0 },
  ],
  sportcenter: [
    { id: 'sport-basic', name: 'Базовая защита', description: 'Защита от травм', cost: 12, discount: 0 },
    { id: 'sport-premium', name: 'Премиум защита', description: 'Защита от травм и ответственность перед клиентами', cost: 30, discount: 10 },
  ],
  airport: [
    { id: 'travel-basic', name: 'Базовая страховка', description: 'Защита от задержки и отмены рейса', cost: 15, discount: 0 },
    { id: 'travel-premium', name: 'Премиум страховка', description: 'Полная защита путешествия с багажом', cost: 35, discount: 5 },
  ]
};

// Risk icons mapping
const riskIcons = {
  fire: '🔥',
  flood: '💧',
  theft: '🚨',
  accident: '💥',
  damage: '🔨',
  injury: '🩹',
  liability: '⚖️',
  delay: '⏱️',
  cancellation: '❌',
  baggage: '🧳',
};

// Building emojis for visual representation
const buildingEmojis = {
  house: '🏠',
  car: '🚗',
  sportcenter: '🏋️',
  airport: '✈️'
};

// Styled components
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #a7d8ff 0%, #eaf6ff 100%);
  padding-bottom: 80px;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: var(--shadow-md);
  z-index: 10;
  cursor: pointer;
`;

const BuildingHeader = styled.div`
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  padding-top: 80px;
`;

const BuildingIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
`;

const BuildingTitle = styled.h1`
  margin-bottom: var(--spacing-xs);
`;

const BuildingDescription = styled.p`
  opacity: 0.8;
  margin-bottom: var(--spacing-lg);
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 var(--spacing-md) var(--spacing-lg);
`;

const Tab = styled.button`
  flex: 1;
  padding: var(--spacing-sm) 0;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-light)'};
  border-bottom: ${props => props.active ? '3px solid var(--color-primary)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const TabContent = styled(motion.div)`
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin: 0 var(--spacing-md);
`;

const LevelUpgrade = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ProgressBar = styled.div`
  height: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin: var(--spacing-md) 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: var(--color-primary);
  border-radius: 5px;
`;

const CostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
`;

const Cost = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const CostIcon = styled.span`
  font-size: 1.2rem;
`;

const UpgradeButton = styled(motion.button)`
  width: 100%;
  padding: var(--spacing-sm) 0;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  margin-top: var(--spacing-md);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const PolicyCard = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background: white;
`;

const PolicyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
`;

const PolicyTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--color-primary);
`;

const PolicyCost = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Discount = styled.span`
  background: var(--color-success);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 4px;
`;

const RiskList = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin: var(--spacing-sm) 0;
`;

const RiskItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const RiskIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const RiskName = styled.span`
  font-size: 0.7rem;
  color: var(--color-text-light);
`;

const ApplyButton = styled(motion.button)`
  width: 100%;
  padding: var(--spacing-xs) 0;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  margin-top: var(--spacing-xs);
  cursor: pointer;
`;

// Risk names in Russian
const riskNames = {
  fire: 'Пожар',
  flood: 'Затопление',
  theft: 'Кража',
  accident: 'ДТП',
  damage: 'Повреждение',
  injury: 'Травма',
  liability: 'Ответственность',
  delay: 'Задержка',
  cancellation: 'Отмена',
  baggage: 'Багаж',
};

const BuildingDetail = ({ userData, updateUserData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upgrade');
  
  // Find the current building in user data
  const building = userData.buildings.find(b => b.id === id);
  const buildingInfo = buildingTypes[id];
  
  // Get the relevant policies for this building
  const policies = insurancePolicies[id] || [];
  
  useEffect(() => {
    if (!building || !buildingInfo) {
      navigate('/city'); // Redirect if building not found
    }
  }, [building, buildingInfo, navigate]);
  
  if (!building || !buildingInfo) {
    return null; // Don't render anything while redirecting
  }
  
  const handleUpgrade = () => {
    const nextLevel = building.level + 1;
    
    // Check if next level exists and user has enough resources
    if (
      nextLevel <= buildingInfo.levels.length &&
      userData.tokens >= buildingInfo.levels[nextLevel - 1].cost &&
      userData.energy >= buildingInfo.levels[nextLevel - 1].energyCost
    ) {
      // Perform upgrade
      const updatedBuildings = userData.buildings.map(b => {
        if (b.id === building.id) {
          return { ...b, level: nextLevel };
        }
        return b;
      });
      
      // Update user data
      updateUserData({
        tokens: userData.tokens - buildingInfo.levels[nextLevel - 1].cost,
        energy: userData.energy - buildingInfo.levels[nextLevel - 1].energyCost,
        buildings: updatedBuildings
      });
      
      // Show reward screen
      navigate(`/reward/upgrade?building=${id}&level=${nextLevel}`);
    }
  };
  
  const handleBuyPolicy = (policy) => {
    // Check if user has enough tokens
    if (userData.tokens >= policy.cost) {
      // Apply the policy to the building
      const updatedBuildings = userData.buildings.map(b => {
        if (b.id === building.id) {
          return { ...b, protected: true, policyId: policy.id };
        }
        return b;
      });
      
      // Update user data
      updateUserData({
        tokens: userData.tokens - policy.cost,
        buildings: updatedBuildings
      });
      
      // Show reward screen
      navigate(`/reward/policy?building=${id}&policy=${policy.id}`);
    }
  };
  
  return (
    <DetailContainer>
      <BackButton
        onClick={() => navigate('/city')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ←
      </BackButton>
      
      <BuildingHeader>
        <BuildingIcon>{buildingEmojis[id]}</BuildingIcon>
        <BuildingTitle>{buildingInfo.name}</BuildingTitle>
        <BuildingDescription>{buildingInfo.description}</BuildingDescription>
      </BuildingHeader>
      
      <TabContainer>
        <Tab
          active={activeTab === 'upgrade'}
          onClick={() => setActiveTab('upgrade')}
        >
          Улучшить
        </Tab>
        <Tab
          active={activeTab === 'protect'}
          onClick={() => setActiveTab('protect')}
        >
          Защитить
        </Tab>
      </TabContainer>
      
      <AnimatePresence mode="wait">
        {activeTab === 'upgrade' && (
          <TabContent
            key="upgrade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LevelUpgrade>
              <h2>Текущий уровень: {building.level}</h2>
              <p>{buildingInfo.levels[building.level - 1].description}</p>
              
              {building.level < buildingInfo.levels.length && (
                <>
                  <ProgressBar>
                    <ProgressFill percentage={(building.level / buildingInfo.levels.length) * 100} />
                  </ProgressBar>
                  
                  <h3>Следующее улучшение:</h3>
                  <p>{buildingInfo.levels[building.level].description}</p>
                  
                  <CostInfo>
                    <Cost>
                      <CostIcon>💎</CostIcon>
                      {buildingInfo.levels[building.level].cost} токенов
                    </Cost>
                    <Cost>
                      <CostIcon>⚡</CostIcon>
                      {buildingInfo.levels[building.level].energyCost} энергии
                    </Cost>
                  </CostInfo>
                  
                  <UpgradeButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={
                      userData.tokens < buildingInfo.levels[building.level].cost ||
                      userData.energy < buildingInfo.levels[building.level].energyCost
                    }
                    onClick={handleUpgrade}
                  >
                    Улучшить
                  </UpgradeButton>
                </>
              )}
              
              {building.level === buildingInfo.levels.length && (
                <p>Достигнут максимальный уровень улучшения!</p>
              )}
            </LevelUpgrade>
          </TabContent>
        )}
        
        {activeTab === 'protect' && (
          <TabContent
            key="protect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2>Доступные щиты</h2>
            <p>Выберите страховой полис для защиты от рисков:</p>
            
            {policies.map(policy => (
              <PolicyCard key={policy.id}>
                <PolicyHeader>
                  <PolicyTitle>{policy.name}</PolicyTitle>
                  <PolicyCost>
                    <CostIcon>💎</CostIcon>
                    {policy.cost}
                    {policy.discount > 0 && <Discount>-{policy.discount}%</Discount>}
                  </PolicyCost>
                </PolicyHeader>
                
                <p>{policy.description}</p>
                
                <RiskList>
                  {buildingInfo.risks.slice(0, policy.id.includes('premium') ? undefined : 2).map(risk => (
                    <RiskItem key={risk}>
                      <RiskIcon>{riskIcons[risk]}</RiskIcon>
                      <RiskName>{riskNames[risk]}</RiskName>
                    </RiskItem>
                  ))}
                </RiskList>
                
                <ApplyButton
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBuyPolicy(policy)}
                  disabled={userData.tokens < policy.cost}
                >
                  {building.protected && building.policyId === policy.id ? 'Активен' : 'Применить'}
                </ApplyButton>
              </PolicyCard>
            ))}
            
            {building.protected && (
              <div style={{ textAlign: 'center', color: 'var(--color-success)', marginTop: 'var(--spacing-md)' }}>
                ✓ Объект защищен полисом
              </div>
            )}
          </TabContent>
        )}
      </AnimatePresence>
    </DetailContainer>
  );
};

export default BuildingDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for risk events
const riskEventData = {
  house: {
    fire: {
      title: 'Пожар!',
      description: 'В вашем доме начался пожар из-за короткого замыкания.',
      animation: 'fire',
      consequences: 'Без защиты: повреждение имущества на сумму 50 токенов.',
      protection: 'Страховой полис покроет все убытки.'
    },
    flood: {
      title: 'Затопление!',
      description: 'Прорыв трубы привел к затоплению вашего дома.',
      animation: 'water',
      consequences: 'Без защиты: ремонт на сумму 30 токенов.',
      protection: 'Страховой полис покроет все убытки.'
    },
    theft: {
      title: 'Кража!',
      description: 'В ваш дом проникли воры и похитили ценные вещи.',
      animation: 'theft',
      consequences: 'Без защиты: потеря имущества на сумму 40 токенов.',
      protection: 'Страховой полис возместит стоимость украденного.'
    }
  },
  car: {
    accident: {
      title: 'ДТП!',
      description: 'Ваш автомобиль попал в дорожно-транспортное происшествие.',
      animation: 'crash',
      consequences: 'Без защиты: ремонт на сумму 35 токенов.',
      protection: 'Страховой полис КАСКО покроет все расходы на ремонт.'
    },
    theft: {
      title: 'Угон!',
      description: 'Ваш автомобиль был угнан со стоянки.',
      animation: 'theft',
      consequences: 'Без защиты: потеря автомобиля, стоимость 60 токенов.',
      protection: 'Страховой полис КАСКО возместит полную стоимость.'
    },
    damage: {
      title: 'Град!',
      description: 'Сильный град повредил кузов вашего автомобиля.',
      animation: 'hail',
      consequences: 'Без защиты: ремонт кузова на сумму 25 токенов.',
      protection: 'Страховой полис КАСКО покроет расходы на ремонт.'
    }
  },
  sportcenter: {
    injury: {
      title: 'Травма!',
      description: 'Посетитель получил травму во время тренировки.',
      animation: 'injury',
      consequences: 'Без защиты: компенсация и лечение на сумму 45 токенов.',
      protection: 'Страховка от несчастных случаев покроет все расходы.'
    },
    fire: {
      title: 'Пожар!',
      description: 'В спортцентре произошло возгорание электропроводки.',
      animation: 'fire',
      consequences: 'Без защиты: ремонт помещения на сумму 55 токенов.',
      protection: 'Страховка имущества покроет расходы на восстановление.'
    },
    liability: {
      title: 'Иск!',
      description: 'Клиент подал в суд из-за некачественного оборудования.',
      animation: 'lawsuit',
      consequences: 'Без защиты: судебные издержки на сумму 50 токенов.',
      protection: 'Страховка ответственности покроет все судебные расходы.'
    }
  },
  airport: {
    delay: {
      title: 'Задержка рейса!',
      description: 'Ваш рейс задержан на 8 часов из-за погодных условий.',
      animation: 'delay',
      consequences: 'Без защиты: дополнительные расходы на сумму 20 токенов.',
      protection: 'Туристическая страховка компенсирует все дополнительные расходы.'
    },
    cancellation: {
      title: 'Отмена рейса!',
      description: 'Ваш рейс отменен из-за технических проблем у авиакомпании.',
      animation: 'cancel',
      consequences: 'Без защиты: потеря стоимости билета, 40 токенов.',
      protection: 'Страховка путешествий вернет полную стоимость билета.'
    },
    baggage: {
      title: 'Потеря багажа!',
      description: 'Авиакомпания потеряла ваш багаж при пересадке.',
      animation: 'baggage',
      consequences: 'Без защиты: потеря вещей на сумму 35 токенов.',
      protection: 'Страховка багажа возместит стоимость утерянных вещей.'
    }
  }
};

// Building emojis for visual representation
const buildingEmojis = {
  house: '🏠',
  car: '🚗',
  sportcenter: '🏋️',
  airport: '✈️'
};

// Risk animations
const animations = {
  fire: '🔥',
  water: '💧',
  theft: '🚨',
  crash: '💥',
  hail: '❄️',
  injury: '🩹',
  lawsuit: '⚖️',
  delay: '⏱️',
  cancel: '❌',
  baggage: '🧳',
};

// Styled components
const EventContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #420835 0%, #8e1d41 100%);
  color: white;
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
`;

const BuildingView = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
`;

const BuildingIcon = styled(motion.div)`
  font-size: 8rem;
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 2;
`;

const AnimationOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10rem;
  opacity: 0.6;
  z-index: 1;
  pointer-events: none;
`;

const EventTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const EventDescription = styled(motion.p)`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const ShieldButton = styled(motion.button)`
  padding: var(--spacing-md);
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
`;

const ChanceButton = styled(motion.button)`
  padding: var(--spacing-md);
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
`;

const InfoBox = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-top: var(--spacing-lg);
  width: 100%;
  max-width: 400px;
`;

const InfoTitle = styled.h3`
  margin-bottom: var(--spacing-xs);
  font-size: 1.1rem;
`;

const InfoContent = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
`;

// Map building IDs to risk arrays
const buildingRisks = {
  house: ['fire', 'flood', 'theft'],
  car: ['accident', 'theft', 'damage'],
  sportcenter: ['injury', 'fire', 'liability'],
  airport: ['delay', 'cancellation', 'baggage']
};

const RiskEvent = ({ userData, updateUserData }) => {
  const { id } = useParams(); // Building ID
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Find the current building in user data
  const building = userData.buildings.find(b => b.id === id);
  
  // Randomly select a risk for this building
  const [selectedRisk, setSelectedRisk] = useState(null);
  
  useEffect(() => {
    if (building) {
      const risks = buildingRisks[building.id];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      setSelectedRisk(randomRisk);
    } else {
      // Redirect to city if building not found
      navigate('/city');
    }
  }, [building, navigate]);
  
  if (!building || !selectedRisk) {
    return null; // Don't render anything while redirecting or loading
  }
  
  const riskEvent = riskEventData[building.id][selectedRisk];
  
  const handleUseShield = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      // Mark event as handled in user data
      const updatedEvents = [...(userData.completedEvents || []), {
        id: Date.now(),
        buildingId: building.id,
        risk: selectedRisk,
        outcome: 'protected',
        timestamp: new Date().toISOString()
      }];
      
      updateUserData({
        completedEvents: updatedEvents
      });
      
      // Navigate to reward screen
      navigate(`/reward/shield?building=${building.id}&risk=${selectedRisk}`);
    }, 1200);
  };
  
  const handleTakeChance = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      // 30% chance to avoid damage
      const isLucky = Math.random() > 0.7;
      
      // Mark event as handled in user data
      const updatedEvents = [...(userData.completedEvents || []), {
        id: Date.now(),
        buildingId: building.id,
        risk: selectedRisk,
        outcome: isLucky ? 'lucky' : 'damaged',
        timestamp: new Date().toISOString()
      }];
      
      let updatedUserData = { completedEvents: updatedEvents };
      
      // If unlucky and not protected, reduce tokens
      if (!isLucky && !building.protected) {
        const damageAmount = Math.floor(Math.random() * 20) + 10; // Random damage between 10-30 tokens
        updatedUserData.tokens = Math.max(0, userData.tokens - damageAmount);
      }
      
      updateUserData(updatedUserData);
      
      // Navigate to reward screen
      navigate(`/reward/chance?building=${building.id}&risk=${selectedRisk}&outcome=${isLucky ? 'lucky' : 'damaged'}`);
    }, 1200);
  };
  
  return (
    <EventContainer>
      <AnimationOverlay
        initial={{ opacity: 0, scale: 3 }}
        animate={{ opacity: [0, 0.8, 0.6], scale: [3, 1, 1.2] }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {animations[riskEvent.animation]}
      </AnimationOverlay>
      
      <BuildingView>
        <BuildingIcon
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {buildingEmojis[building.id]}
        </BuildingIcon>
        
        <EventTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {riskEvent.title}
        </EventTitle>
        
        <EventDescription
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {riskEvent.description}
        </EventDescription>
        
        <InfoBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <InfoTitle>Последствия:</InfoTitle>
          <InfoContent>{riskEvent.consequences}</InfoContent>
          
          {building.protected && (
            <>
              <InfoTitle style={{ marginTop: 'var(--spacing-sm)', color: 'var(--color-success)' }}>
                У вас есть защита!
              </InfoTitle>
              <InfoContent>{riskEvent.protection}</InfoContent>
            </>
          )}
        </InfoBox>
        
        <ButtonsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <ShieldButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUseShield}
            disabled={isProcessing}
          >
            <span role="img" aria-label="shield">🛡️</span>
            Применить щит
            {!building.protected && <span>(демо)</span>}
          </ShieldButton>
          
          <ChanceButton
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTakeChance}
            disabled={isProcessing}
          >
            Сыграть на удачу
          </ChanceButton>
        </ButtonsContainer>
      </BuildingView>
    </EventContainer>
  );
};

export default RiskEvent;

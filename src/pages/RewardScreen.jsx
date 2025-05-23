import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Building emojis for visual representation
const buildingEmojis = {
  house: '🏠',
  car: '🚗',
  sportcenter: '🏋️',
  airport: '✈️'
};

// Insurance policy type names
const policyNames = {
  'home-basic': 'Базовая защита дома',
  'home-premium': 'Премиум защита дома',
  'car-osago': 'ОСАГО',
  'car-kasko': 'КАСКО',
  'sport-basic': 'Спортивная страховка',
  'sport-premium': 'Премиум спортивная страховка',
  'travel-basic': 'Базовая страховка путешествий',
  'travel-premium': 'Премиум страховка путешествий'
};

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

// Building names in Russian
const buildingNames = {
  house: 'Дом',
  car: 'Автомобиль',
  sportcenter: 'Спортцентр',
  airport: 'Аэропорт',
};

// Styled components
const RewardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #8e1d41 0%, #420835 100%);
  color: white;
  text-align: center;
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
`;

const ConfettiOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 500px;
  width: 100%;
`;

const RewardCard = styled(motion.div)`
  background: white;
  color: var(--color-text);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--spacing-xl);
`;

const RewardHeader = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const RewardTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
`;

const RewardIcon = styled.div`
  font-size: 4rem;
  margin: var(--spacing-md) 0;
`;

const RewardItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.03);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
`;

const RewardItemIcon = styled.span`
  font-size: 1.5rem;
`;

const RewardItemText = styled.span`
  font-weight: 500;
`;

const CouponCard = styled(motion.div)`
  background: linear-gradient(45deg, #f5f5f5 0%, #ffffff 100%);
  border: 2px dashed var(--color-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    top: 10px;
    right: 10px;
    width: 60px;
    height: 60px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238e1d41' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z'%3E%3C/path%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
    transform: rotate(15deg);
  }
`;

const CouponTitle = styled.h3`
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
`;

const CouponCode = styled.div`
  font-family: monospace;
  font-size: 1.2rem;
  letter-spacing: 1px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(142, 29, 65, 0.1);
  border-radius: var(--border-radius-sm);
  display: inline-block;
  margin-top: var(--spacing-xs);
`;

const ContinueButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: var(--spacing-md);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const UseCouponButton = styled(motion.button)`
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  margin-top: var(--spacing-sm);
`;

// Simple confetti component
const Confetti = () => {
  useEffect(() => {
    // Create confetti pieces
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 5;
        
        // Apply styles
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${animationDuration}s`;
        confetti.style.animationDelay = `${animationDelay}s`;
        
        confettiContainer.appendChild(confetti);
      }
    }
    
    // Clean up confetti
    return () => {
      const confettiContainer = document.getElementById('confetti-container');
      if (confettiContainer) {
        confettiContainer.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <ConfettiOverlay id="confetti-container">
      <style jsx="true">{`
        .confetti {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 10px;
          background-color: #ff0000;
          opacity: 0.7;
          animation: fall linear forwards;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </ConfettiOverlay>
  );
};

const RewardScreen = ({ userData, updateUserData }) => {
  const { type } = useParams(); // Type of reward (upgrade, shield, chance)
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const buildingId = queryParams.get('building');
  const building = userData.buildings.find(b => b.id === buildingId);
  
  const [rewardInfo, setRewardInfo] = useState(null);
  
  useEffect(() => {
    // Generate reward info based on type and query parameters
    if (type === 'upgrade') {
      const level = parseInt(queryParams.get('level'), 10);
      setRewardInfo({
        title: 'Улучшение завершено!',
        description: `Вы успешно улучшили ${buildingNames[buildingId] || 'здание'} до уровня ${level}.`,
        icon: buildingEmojis[buildingId],
        rewards: [
          { icon: '⭐', text: `+${level * 10} XP` },
          { icon: '💎', text: `+${level * 2} токенов` },
        ],
        coupon: {
          title: `Скидка ${level * 3}% на страхование`,
          code: `UPGRADE${Date.now().toString().substring(5, 11)}`,
          discount: level * 3
        }
      });
    }
    else if (type === 'policy') {
      const policyId = queryParams.get('policy');
      setRewardInfo({
        title: 'Защита установлена!',
        description: `Вы успешно защитили ${buildingNames[buildingId] || 'здание'} с помощью страховки.`,
        icon: '🛡️',
        rewards: [
          { icon: '⭐', text: `+15 XP` },
          { icon: '💎', text: `+3 токенов` },
        ],
        coupon: null,
        policyName: policyNames[policyId] || 'Страховой полис'
      });
    }
    else if (type === 'shield') {
      const risk = queryParams.get('risk');
      setRewardInfo({
        title: 'Щит сработал!',
        description: `Вы успешно защитили ${buildingNames[buildingId] || 'здание'} от риска "${riskNames[risk] || risk}".`,
        icon: '🛡️',
        rewards: [
          { icon: '⭐', text: `+25 XP` },
          { icon: '💎', text: `+5 токенов` },
        ],
        coupon: {
          title: `Скидка 10% на страхование от ${riskNames[risk] || 'рисков'}`,
          code: `SHIELD${Date.now().toString().substring(5, 11)}`,
          discount: 10
        }
      });
    }
    else if (type === 'chance') {
      const risk = queryParams.get('risk');
      const outcome = queryParams.get('outcome');
      
      if (outcome === 'lucky') {
        setRewardInfo({
          title: 'Вам повезло!',
          description: `Вы избежали последствий риска "${riskNames[risk] || risk}" без страховки. Но лучше не рисковать!`,
          icon: '🍀',
          rewards: [
            { icon: '⭐', text: `+10 XP` },
            { icon: '💎', text: `+2 токенов` },
          ],
          coupon: {
            title: `Скидка 5% на страхование от ${riskNames[risk] || 'рисков'}`,
            code: `LUCKY${Date.now().toString().substring(5, 11)}`,
            discount: 5
          }
        });
      } else {
        setRewardInfo({
          title: 'Не повезло...',
          description: `${buildingNames[buildingId] || 'Здание'} пострадало от "${riskNames[risk] || risk}". В следующий раз лучше воспользуйтесь страховкой!`,
          icon: '😟',
          rewards: [
            { icon: '⭐', text: `+5 XP за опыт` },
          ],
          coupon: {
            title: `Скидка 15% на страхование от ${riskNames[risk] || 'рисков'}`,
            code: `LESSON${Date.now().toString().substring(5, 11)}`,
            discount: 15
          }
        });
      }
    }
  }, [type, queryParams, buildingId]);
  
  const handleContinue = () => {
    // Add rewards to user data
    let xpGain = 0;
    let tokenGain = 0;
    
    if (rewardInfo?.rewards) {
      rewardInfo.rewards.forEach(reward => {
        if (reward.text.includes('XP')) {
          xpGain = parseInt(reward.text.match(/\d+/)[0], 10);
        }
        if (reward.text.includes('токен')) {
          tokenGain = parseInt(reward.text.match(/\d+/)[0], 10);
        }
      });
    }
    
    if (xpGain > 0 || tokenGain > 0) {
      updateUserData({
        tokens: userData.tokens + tokenGain,
        // Simplified level mechanism
        level: xpGain >= 50 ? userData.level + 1 : userData.level
      });
    }
    
    // Navigate back to city
    navigate('/city');
  };
  
  const handleUseCoupon = () => {
    // In a real app, this would navigate to a purchase screen
    // For demo, we'll just go back to the building
    navigate(`/building/${buildingId}`);
  };
  
  if (!rewardInfo) {
    return null; // Loading or invalid reward type
  }
  
  return (
    <RewardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti />
      
      <ContentWrapper
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <RewardCard>
          <RewardHeader>
            <RewardTitle>{rewardInfo.title}</RewardTitle>
            <p>{rewardInfo.description}</p>
          </RewardHeader>
          
          <RewardIcon>
            {rewardInfo.icon}
          </RewardIcon>
          
          {rewardInfo.policyName && (
            <div style={{ margin: 'var(--spacing-md) 0' }}>
              <strong>Активирована страховка:</strong>
              <div>{rewardInfo.policyName}</div>
            </div>
          )}
          
          <RewardItems>
            {rewardInfo.rewards.map((reward, index) => (
              <RewardItem key={index}>
                <RewardItemIcon>{reward.icon}</RewardItemIcon>
                <RewardItemText>{reward.text}</RewardItemText>
              </RewardItem>
            ))}
          </RewardItems>
          
          {rewardInfo.coupon && (
            <CouponCard
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CouponTitle>{rewardInfo.coupon.title}</CouponTitle>
              <div>Используйте этот купон при оформлении полиса</div>
              <CouponCode>{rewardInfo.coupon.code}</CouponCode>
              
              <UseCouponButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUseCoupon}
              >
                Использовать сейчас
              </UseCouponButton>
            </CouponCard>
          )}
        </RewardCard>
        
        <ContinueButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
        >
          Вернуться в город
        </ContinueButton>
      </ContentWrapper>
    </RewardContainer>
  );
};

export default RewardScreen;

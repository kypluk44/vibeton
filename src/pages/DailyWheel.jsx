import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #8e1d41 0%, #420835 100%);
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
  overflow: hidden;
  padding-bottom: 100px;
`;

const PageHeader = styled.div`
  color: white;
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`;

const WheelBackground = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  top: -10px;
  left: -10px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
`;

const Wheel = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  transform-origin: center;
`;

const WheelSection = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: bottom right;
  left: 0;
  top: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transform: ${props => `rotate(${props.rotation}deg) skew(${props.skew}deg)`};
  background: ${props => props.color};
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  span {
    position: absolute;
    transform: ${props => `rotate(${props.textRotation}deg) translate(70px) rotate(${props.textRotation2}deg)`};
    width: 60px;
    font-size: 0.9rem;
    text-align: center;
  }
`;

const Pointer = styled.div`
  position: absolute;
  top: -20px;
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  z-index: 10;
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3));
`;

const SpinButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  background: white;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.2rem;
  border: none;
  border-radius: var(--border-radius-lg);
  margin-top: var(--spacing-xl);
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StreakInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-sm) var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
`;

const StreakDays = styled.div`
  display: flex;
  gap: 6px;
`;

const StreakDay = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: ${props => props.active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: bold;
`;

const ResultModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ResultContent = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  max-width: 350px;
  width: 80%;
  text-align: center;
`;

const PrizeIcon = styled.div`
  font-size: 4rem;
  margin: var(--spacing-lg) 0;
`;

const CloseButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  margin-top: var(--spacing-lg);
  cursor: pointer;
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

// Wheel prizes
const wheelPrizes = [
  { text: '+10 токенов', icon: '💎', value: { tokens: 10 }, color: '#6A1B9A' },
  { text: '+5 энергии', icon: '⚡', value: { energy: 5 }, color: '#1565C0' },
  { text: '+20 токенов', icon: '💎', value: { tokens: 20 }, color: '#D32F2F' },
  { text: '+15 энергии', icon: '⚡', value: { energy: 15 }, color: '#00695C' },
  { text: '+25 токенов', icon: '💎', value: { tokens: 25 }, color: '#EF6C00' },
  { text: 'Редкий скин', icon: '🎨', value: { skin: 'winter_house' }, color: '#1E88E5' },
  { text: '+30 токенов', icon: '💎', value: { tokens: 30 }, color: '#AD1457' },
  { text: 'Полный заряд', icon: '🔋', value: { energy: 100 }, color: '#2E7D32' },
];

const DailyWheel = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [prize, setPrize] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const wheelRef = useRef(null);
  
  // Mock streak data
  const [streakDays, setStreakDays] = useState([
    { day: 'Пн', active: true },
    { day: 'Вт', active: true },
    { day: 'Ср', active: true },
    { day: 'Чт', active: false },
    { day: 'Пт', active: false },
    { day: 'Сб', active: false },
    { day: 'Вс', active: false },
  ]);
  
  // Check if the user already spun the wheel today
  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastWheelSpin');
    
    if (lastSpinDate) {
      const today = new Date().toDateString();
      if (lastSpinDate === today) {
        setCanSpin(false);
      }
    }
  }, []);
  
  const handleSpin = () => {
    if (isSpinning || !canSpin) return;
    
    setIsSpinning(true);
    
    // Number of full rotations plus random section
    const totalSections = wheelPrizes.length;
    const sectionAngle = 360 / totalSections;
    
    // Randomly select a prize index
    const prizeIndex = Math.floor(Math.random() * totalSections);
    
    // Calculate the target angle
    // We need to add 270 degrees to align with the pointer at the top
    // and then subtract the section's middle angle
    const targetAngle = 270 - (prizeIndex * sectionAngle) - (sectionAngle / 2);
    
    // Add multiple full spins plus the target angle
    const fullSpins = 5 * 360; // 5 full rotations
    const finalAngle = fullSpins + targetAngle;
    
    // Start spinning animation
    setRotationAngle(finalAngle);
    
    // Set prize and show result after the spin animation
    setTimeout(() => {
      setPrize(wheelPrizes[prizeIndex]);
      setShowResult(true);
      setIsSpinning(false);
      
      // Save spin date to localStorage
      localStorage.setItem('lastWheelSpin', new Date().toDateString());
      setCanSpin(false);
      
      // Update user data with the prize
      const prizeValue = wheelPrizes[prizeIndex].value;
      
      const updatedUserData = { ...userData };
      
      if (prizeValue.tokens) {
        updatedUserData.tokens = (userData.tokens || 0) + prizeValue.tokens;
      }
      
      if (prizeValue.energy) {
        updatedUserData.energy = Math.min((userData.energy || 0) + prizeValue.energy, 100);
      }
      
      if (prizeValue.skin) {
        updatedUserData.inventory = [...(userData.inventory || []), { type: 'skin', id: prizeValue.skin, name: 'Зимний домик' }];
      }
      
      updateUserData(updatedUserData);
      
      // Update streak
      const newStreakDays = [...streakDays];
      for (let i = 0; i < newStreakDays.length; i++) {
        if (!newStreakDays[i].active) {
          newStreakDays[i].active = true;
          break;
        }
      }
      setStreakDays(newStreakDays);
      
    }, 5000); // Match this to the CSS animation duration
  };
  
  const handleCloseResult = () => {
    setShowResult(false);
    // Navigate back to city
    navigate('/city');
  };
  
  return (
    <WheelContainer>
      <BackButton
        onClick={() => navigate('/city')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ←
      </BackButton>
      
      <PageHeader>
        <PageTitle>Колесо фортуны</PageTitle>
        <p style={{ color: 'white', opacity: 0.8 }}>Крутите колесо каждый день и получайте призы</p>
      </PageHeader>
      
      <StreakInfo>
        <div style={{ marginRight: 'var(--spacing-md)' }}>Ваша серия: </div>
        <StreakDays>
          {streakDays.map((day, index) => (
            <StreakDay key={index} active={day.active}>
              {day.day}
            </StreakDay>
          ))}
        </StreakDays>
      </StreakInfo>
      
      <WheelWrapper>
        <WheelBackground />
        <Pointer />
        <Wheel
          ref={wheelRef}
          animate={{ rotate: rotationAngle }}
          transition={{ 
            duration: 5,
            ease: [0.2, 0.5, 0.2, 1],
          }}
        >
          {wheelPrizes.map((prize, index) => {
            const rotation = (360 / wheelPrizes.length) * index;
            const skewAngle = (90 - 360 / wheelPrizes.length);
            const textRotation = rotation;
            const textRotation2 = -rotation - skewAngle - 90;
            
            return (
              <WheelSection 
                key={index}
                rotation={rotation}
                skew={skewAngle}
                textRotation={textRotation}
                textRotation2={textRotation2}
                color={prize.color}
              >
                <span>{prize.icon}</span>
              </WheelSection>
            );
          })}
        </Wheel>
      </WheelWrapper>
      
      <SpinButton
        disabled={isSpinning || !canSpin}
        whileHover={canSpin ? { scale: 1.05 } : {}}
        whileTap={canSpin ? { scale: 0.95 } : {}}
        onClick={handleSpin}
      >
        {canSpin ? 'КРУТИТЬ!' : 'Вернитесь завтра'}
      </SpinButton>
      
      {!canSpin && !isSpinning && !showResult && (
        <p style={{ color: 'white', marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
          Вы уже крутили колесо сегодня. Возвращайтесь завтра для нового приза!
        </p>
      )}
      
      {showResult && (
        <ResultModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ResultContent
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <h2>Ваш приз!</h2>
            <PrizeIcon>{prize?.icon}</PrizeIcon>
            <h3>{prize?.text}</h3>
            
            <CloseButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCloseResult}
            >
              Забрать
            </CloseButton>
          </ResultContent>
        </ResultModal>
      )}
    </WheelContainer>
  );
};

export default DailyWheel;

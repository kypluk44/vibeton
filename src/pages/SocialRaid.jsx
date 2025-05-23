import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for friends
const mockFriends = [
  { id: 1, name: 'Анна К.', avatar: '👩', level: 5, contribution: 35 },
  { id: 2, name: 'Дмитрий Л.', avatar: '👨', level: 7, contribution: 42 },
  { id: 3, name: 'Елена М.', avatar: '👩', level: 4, contribution: 28 },
  { id: 4, name: 'Иван П.', avatar: '👨', level: 6, contribution: 38 },
  { id: 5, name: 'Мария С.', avatar: '👩', level: 3, contribution: 20 },
];

// Mock data for current raid
const raidEvent = {
  id: 'storm-2023',
  name: 'Супер-шторм',
  description: 'Мощный шторм надвигается на все города! Объединитесь с друзьями, чтобы защитить свои здания.',
  totalPower: 500,
  timeLeft: '23:45:12',
  rewards: [
    { threshold: 100, icon: '💎', text: '+10 токенов' },
    { threshold: 250, icon: '⚡', text: '+25 энергии' },
    { threshold: 500, icon: '🏆', text: 'Редкий скин "Укрепленный дом"' },
  ]
};

// Styled Components
const RaidContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #4e0f69 0%, #8e1d41 100%);
  padding: var(--spacing-md);
  padding-bottom: 80px;
  color: white;
`;

const RaidHeader = styled.div`
  text-align: center;
  margin: var(--spacing-lg) 0;
`;

const RaidTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
`;

const RaidDescription = styled.p`
  opacity: 0.8;
  margin-bottom: var(--spacing-md);
`;

const RaidCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const RaidInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
`;

const RaidInfoItem = styled.div`
  text-align: center;
`;

const RaidInfoLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: var(--spacing-xs);
`;

const RaidInfoValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const ProgressContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ProgressTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
`;

const ProgressBar = styled.div`
  height: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min(100, props.percentage)}%;
  background: linear-gradient(90deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  border-radius: 10px;
  transition: width 1s ease-out;
`;

const ProgressMarkers = styled.div`
  position: relative;
  height: 20px;
  margin-top: -20px;
`;

const ProgressMarker = styled.div`
  position: absolute;
  left: ${props => (props.position / props.total) * 100}%;
  transform: translateX(-50%);
  width: 4px;
  height: 20px;
  background: ${props => props.achieved ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.5)'};
  
  &::after {
    content: "${props => props.achieved ? '✓' : ''}";
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-success);
    font-size: 1rem;
  }
`;

const RewardsContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const RewardsList = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
`;

const RewardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.achieved ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  min-width: 80px;
`;

const RewardIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
`;

const RewardText = styled.div`
  font-size: 0.8rem;
  text-align: center;
`;

const FriendsContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
`;

const FriendAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: var(--spacing-sm);
`;

const FriendInfo = styled.div`
  flex: 1;
`;

const FriendName = styled.div`
  font-weight: 500;
`;

const FriendLevel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const FriendContribution = styled.div`
  font-weight: 600;
  color: var(--color-primary-light);
`;

const ShieldButton = styled(motion.button)`
  width: 100%;
  padding: var(--spacing-md);
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
  padding: var(--spacing-md);
`;

const ResultCard = styled(motion.div)`
  background: white;
  color: var(--color-text);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ResultTitle = styled.h2`
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
`;

const ResultImage = styled.div`
  margin: var(--spacing-lg) 0;
  font-size: 5rem;
`;

const CitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
`;

const CityThumbnail = styled.div`
  background: #f0f0f0;
  border-radius: var(--border-radius-sm);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const CloseButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  margin-top: var(--spacing-md);
  cursor: pointer;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  z-index: 10;
`;

const SocialRaid = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [currentPower, setCurrentPower] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userContribution, setUserContribution] = useState(0);
  const [timeLeft, setTimeLeft] = useState(raidEvent.timeLeft);
  
  // Simulate existing progress
  useEffect(() => {
    const initialPower = mockFriends.reduce((total, friend) => total + friend.contribution, 0);
    setCurrentPower(initialPower);
  }, []);
  
  // Simulate countdown timer
  useEffect(() => {
    const parseTimeString = (timeStr) => {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };
    
    const formatTimeString = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    let totalSeconds = parseTimeString(timeLeft);
    
    const timer = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;
        setTimeLeft(formatTimeString(totalSeconds));
      } else {
        clearInterval(timer);
        // Auto-show result when timer ends
        if (!showResult) {
          setShowResult(true);
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);
  
  const handleSendShield = () => {
    const contribution = Math.floor(Math.random() * 30) + 20; // Random between 20-50
    
    setUserContribution(contribution);
    setCurrentPower(prevPower => prevPower + contribution);
    
    // Award tokens to user
    updateUserData({
      tokens: userData.tokens + 5 // Small token reward for participation
    });
    
    // Show result immediately for demo purposes
    // In a real app, you might want to show some animation first
    setShowResult(true);
  };
  
  const handleCloseResult = () => {
    setShowResult(false);
    navigate('/city');
  };
  
  // Calculate which rewards are achieved
  const getRewardStatus = (threshold) => {
    return currentPower >= threshold;
  };
  
  return (
    <RaidContainer>
      <BackButton
        onClick={() => navigate('/city')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ←
      </BackButton>
      
      <RaidHeader>
        <RaidTitle>{raidEvent.name}</RaidTitle>
        <RaidDescription>{raidEvent.description}</RaidDescription>
      </RaidHeader>
      
      <RaidCard>
        <RaidInfo>
          <RaidInfoItem>
            <RaidInfoLabel>Общая сила</RaidInfoLabel>
            <RaidInfoValue>{currentPower}/{raidEvent.totalPower}</RaidInfoValue>
          </RaidInfoItem>
          
          <RaidInfoItem>
            <RaidInfoLabel>Осталось времени</RaidInfoLabel>
            <RaidInfoValue>{timeLeft}</RaidInfoValue>
          </RaidInfoItem>
          
          <RaidInfoItem>
            <RaidInfoLabel>Уровень угрозы</RaidInfoLabel>
            <RaidInfoValue>⚠️⚠️⚠️</RaidInfoValue>
          </RaidInfoItem>
        </RaidInfo>
        
        <ProgressContainer>
          <ProgressTitle>
            <span>Прогресс рейда</span>
            <span>{Math.floor((currentPower / raidEvent.totalPower) * 100)}%</span>
          </ProgressTitle>
          
          <ProgressBar>
            <ProgressFill percentage={(currentPower / raidEvent.totalPower) * 100} />
          </ProgressBar>
          
          <ProgressMarkers>
            {raidEvent.rewards.map(reward => (
              <ProgressMarker
                key={reward.threshold}
                position={reward.threshold}
                total={raidEvent.totalPower}
                achieved={getRewardStatus(reward.threshold)}
              />
            ))}
          </ProgressMarkers>
        </ProgressContainer>
        
        <RewardsContainer>
          <h3>Награды</h3>
          <RewardsList>
            {raidEvent.rewards.map(reward => (
              <RewardItem
                key={reward.threshold}
                achieved={getRewardStatus(reward.threshold)}
              >
                <RewardIcon>
                  {reward.icon}
                  {getRewardStatus(reward.threshold) && (
                    <div style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>✓</div>
                  )}
                </RewardIcon>
                <RewardText>{reward.text}</RewardText>
                <RewardText style={{ opacity: 0.7, fontSize: '0.7rem' }}>
                  {reward.threshold} сила
                </RewardText>
              </RewardItem>
            ))}
          </RewardsList>
        </RewardsContainer>
      </RaidCard>
      
      <FriendsContainer>
        <h3>Участники рейда</h3>
        <FriendsList>
          {/* Current user */}
          <FriendItem>
            <FriendAvatar>👤</FriendAvatar>
            <FriendInfo>
              <FriendName>Вы</FriendName>
              <FriendLevel>Уровень {userData.level}</FriendLevel>
            </FriendInfo>
            <FriendContribution>{userContribution || '-'}</FriendContribution>
          </FriendItem>
          
          {/* Friends list */}
          {mockFriends.map(friend => (
            <FriendItem key={friend.id}>
              <FriendAvatar>{friend.avatar}</FriendAvatar>
              <FriendInfo>
                <FriendName>{friend.name}</FriendName>
                <FriendLevel>Уровень {friend.level}</FriendLevel>
              </FriendInfo>
              <FriendContribution>{friend.contribution}</FriendContribution>
            </FriendItem>
          ))}
        </FriendsList>
      </FriendsContainer>
      
      <ShieldButton
        onClick={handleSendShield}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        disabled={userContribution > 0}
      >
        <span role="img" aria-label="shield">🛡️</span>
        Отправить щит
      </ShieldButton>
      
      {showResult && (
        <ResultModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ResultCard
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            {currentPower >= raidEvent.totalPower ? (
              <>
                <ResultTitle>Рейд успешно завершен!</ResultTitle>
                <p>Вместе с друзьями вы смогли защитить города от шторма.</p>
                
                <ResultImage>🏆</ResultImage>
                
                <h3>Награды получены:</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
                  {raidEvent.rewards.filter(r => getRewardStatus(r.threshold)).map(reward => (
                    <div key={reward.threshold} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem' }}>{reward.icon}</div>
                      <div>{reward.text}</div>
                    </div>
                  ))}
                </div>
                
                <h3>Защищенные города:</h3>
                <CitiesGrid>
                  <CityThumbnail>🏠</CityThumbnail>
                  <CityThumbnail>🏢</CityThumbnail>
                  <CityThumbnail>🏭</CityThumbnail>
                  <CityThumbnail>🏫</CityThumbnail>
                  <CityThumbnail>🏛️</CityThumbnail>
                  <CityThumbnail>🏘️</CityThumbnail>
                </CitiesGrid>
              </>
            ) : (
              <>
                <ResultTitle>Рейд завершен</ResultTitle>
                <p>Вы защитили часть городов, но стихия была слишком сильной.</p>
                
                <ResultImage>🌪️</ResultImage>
                
                <h3>Полученные награды:</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
                  {raidEvent.rewards.filter(r => getRewardStatus(r.threshold)).map(reward => (
                    <div key={reward.threshold} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem' }}>{reward.icon}</div>
                      <div>{reward.text}</div>
                    </div>
                  ))}
                </div>
                
                <p>В следующий раз соберите больше друзей для защиты!</p>
              </>
            )}
            
            <CloseButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCloseResult}
            >
              Закрыть
            </CloseButton>
          </ResultCard>
        </ResultModal>
      )}
    </RaidContainer>
  );
};

export default SocialRaid;

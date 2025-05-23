import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #8e1d41 0%, #420835 100%);
  padding-bottom: 80px;
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

const ProfileHeader = styled.div`
  padding: var(--spacing-xl) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: var(--spacing-md);
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const LevelBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--color-primary);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 3px solid white;
  font-size: 0.9rem;
`;

const Username = styled.h2`
  font-size: 1.8rem;
  margin-bottom: var(--spacing-xs);
`;

const UserStats = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const StatIcon = styled.span`
  font-size: 1.2rem;
`;

const ContentTabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-md);
`;

const Tab = styled.button`
  flex: 1;
  padding: var(--spacing-md) 0;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: ${props => props.active ? '3px solid white' : 'none'};
  cursor: pointer;
`;

const TabContent = styled(motion.div)`
  padding: var(--spacing-md);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  color: white;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
`;

const BuildingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
`;

const BuildingItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
  position: relative;
`;

const BuildingIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-xs);
`;

const BuildingInfo = styled.div`
  font-size: 0.9rem;
`;

const ProtectionBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-success);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const StatsCard = styled(Card)`
  margin-bottom: var(--spacing-md);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const StatValue = styled.div`
  font-weight: 600;
`;

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
`;

const InventoryItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
`;

const InventoryIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
`;

const InventoryName = styled.div`
  font-size: 0.8rem;
  margin-bottom: var(--spacing-xs);
  height: 32px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const UseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: var(--border-radius-sm);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.8rem;
  cursor: pointer;
  width: 100%;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl) 0;
  opacity: 0.7;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
`;

const LogoutButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  cursor: pointer;
  margin-top: var(--spacing-md);
`;

const SettingsSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Switch = styled.div`
  width: 48px;
  height: 24px;
  background: ${props => props.on ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.on ? '26px' : '2px'};
    transition: left 0.3s ease;
  }
`;

// Building emojis for visual representation
const buildingEmojis = {
  house: '🏠',
  car: '🚗',
  sportcenter: '🏋️',
  airport: '✈️'
};

// Building names in Russian
const buildingNames = {
  house: 'Дом',
  car: 'Автомобиль',
  sportcenter: 'Спортцентр',
  airport: 'Аэропорт',
};

// Mock user stats
const userStats = {
  completedEvents: 12,
  protectedBuildings: 3,
  completedStories: 2,
  tokenSpent: 145,
  daysActive: 5,
};

const UserProfile = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buildings');
  
  // State for settings toggles
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    darkMode: false,
    autoProtect: false,
  });
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleToggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleLogout = () => {
    // In a real app, this would handle authentication logout
    // For demo, we'll just clear localStorage and redirect to welcome
    localStorage.removeItem('energogorod_user');
    navigate('/');
  };
  
  const handleUseItem = (item) => {
    // Handle using inventory items - in a real app, this would apply effects
    // For demo, we'll just remove the item from inventory
    const updatedInventory = userData.inventory.filter(i => i.id !== item.id);
    
    updateUserData({
      inventory: updatedInventory
    });
    
    // If item is a skin, we could apply it to a building
    if (item.type === 'skin') {
      // Navigate to the building to show applied skin
      navigate(`/building/${item.forBuilding}`);
    }
  };
  
  return (
    <ProfileContainer>
      <BackButton
        onClick={() => navigate('/city')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ←
      </BackButton>
      
      <ProfileHeader>
        <AvatarContainer>
          <Avatar>
            {userData.username ? userData.username.charAt(0).toUpperCase() : 'Э'}
          </Avatar>
          <LevelBadge>{userData.level}</LevelBadge>
        </AvatarContainer>
        
        <Username>{userData.username || 'Энергомайор'}</Username>
        
        <UserStats>
          <StatItem>
            <StatIcon>💎</StatIcon>
            {userData.tokens}
          </StatItem>
          <StatItem>
            <StatIcon>⚡</StatIcon>
            {userData.energy}/100
          </StatItem>
        </UserStats>
      </ProfileHeader>
      
      <ContentTabs>
        <Tab 
          active={activeTab === 'buildings'} 
          onClick={() => handleTabChange('buildings')}
        >
          Здания
        </Tab>
        <Tab 
          active={activeTab === 'inventory'} 
          onClick={() => handleTabChange('inventory')}
        >
          Инвентарь
        </Tab>
        <Tab 
          active={activeTab === 'stats'} 
          onClick={() => handleTabChange('stats')}
        >
          Статистика
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => handleTabChange('settings')}
        >
          Настройки
        </Tab>
      </ContentTabs>
      
      <AnimatePresence mode="wait">
        {activeTab === 'buildings' && (
          <TabContent
            key="buildings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Мои здания</CardTitle>
              </CardHeader>
              
              <BuildingGrid>
                {userData.buildings.map(building => (
                  <BuildingItem 
                    key={building.id}
                    onClick={() => navigate(`/building/${building.id}`)}
                  >
                    <BuildingIcon>{buildingEmojis[building.id]}</BuildingIcon>
                    <BuildingInfo>
                      {buildingNames[building.id]}
                      <div>Уровень {building.level}</div>
                    </BuildingInfo>
                    {building.protected && <ProtectionBadge>✓</ProtectionBadge>}
                  </BuildingItem>
                ))}
              </BuildingGrid>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Доступно для строительства</CardTitle>
              </CardHeader>
              
              <EmptyState>
                <EmptyStateIcon>🏗️</EmptyStateIcon>
                <div>Новые участки скоро появятся</div>
              </EmptyState>
            </Card>
          </TabContent>
        )}
        
        {activeTab === 'inventory' && (
          <TabContent
            key="inventory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Мои предметы</CardTitle>
              </CardHeader>
              
              {userData.inventory && userData.inventory.length > 0 ? (
                <InventoryGrid>
                  {userData.inventory.map((item, index) => (
                    <InventoryItem key={index}>
                      <InventoryIcon>{item.icon}</InventoryIcon>
                      <InventoryName>{item.name}</InventoryName>
                      <UseButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUseItem(item)}
                      >
                        Использовать
                      </UseButton>
                    </InventoryItem>
                  ))}
                </InventoryGrid>
              ) : (
                <EmptyState>
                  <EmptyStateIcon>📦</EmptyStateIcon>
                  <div>В инвентаре пока пусто</div>
                </EmptyState>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Мои скидки</CardTitle>
              </CardHeader>
              
              {userData.inventory && userData.inventory.filter(item => item.type === 'discount').length > 0 ? (
                <InventoryGrid>
                  {userData.inventory
                    .filter(item => item.type === 'discount')
                    .map((item, index) => (
                      <InventoryItem key={index}>
                        <InventoryIcon>{item.icon}</InventoryIcon>
                        <InventoryName>{item.name}</InventoryName>
                        <UseButton
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUseItem(item)}
                        >
                          Применить
                        </UseButton>
                      </InventoryItem>
                    ))}
                </InventoryGrid>
              ) : (
                <EmptyState>
                  <EmptyStateIcon>🏷️</EmptyStateIcon>
                  <div>У вас пока нет скидок</div>
                </EmptyState>
              )}
            </Card>
          </TabContent>
        )}
        
        {activeTab === 'stats' && (
          <TabContent
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <StatsCard>
              <CardHeader>
                <CardTitle>Достижения</CardTitle>
              </CardHeader>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>🛡️</StatIcon>
                  Завершенные события
                </StatLabel>
                <StatValue>{userData.completedEvents?.length || userStats.completedEvents}</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>🏠</StatIcon>
                  Защищенные здания
                </StatLabel>
                <StatValue>{userData.buildings.filter(b => b.protected).length || userStats.protectedBuildings}</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>📚</StatIcon>
                  Завершенные истории
                </StatLabel>
                <StatValue>{userData.story?.completedChapters?.length || userStats.completedStories}</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>💰</StatIcon>
                  Потрачено токенов
                </StatLabel>
                <StatValue>{userStats.tokenSpent}</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>📅</StatIcon>
                  Дней активности
                </StatLabel>
                <StatValue>{userStats.daysActive}</StatValue>
              </StatRow>
            </StatsCard>
            
            <Card>
              <CardHeader>
                <CardTitle>Текущие цели</CardTitle>
              </CardHeader>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>🎯</StatIcon>
                  Построить все здания
                </StatLabel>
                <StatValue>75%</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>🎯</StatIcon>
                  Защитить все здания
                </StatLabel>
                <StatValue>50%</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>
                  <StatIcon>🎯</StatIcon>
                  Завершить все истории
                </StatLabel>
                <StatValue>25%</StatValue>
              </StatRow>
            </Card>
          </TabContent>
        )}
        
        {activeTab === 'settings' && (
          <TabContent
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Настройки приложения</CardTitle>
              </CardHeader>
              
              <SettingsSection>
                <SettingRow>
                  <SettingLabel>
                    <StatIcon>🔔</StatIcon>
                    Уведомления
                  </SettingLabel>
                  <Switch 
                    on={settings.notifications} 
                    onClick={() => handleToggleSetting('notifications')}
                  />
                </SettingRow>
                
                <SettingRow>
                  <SettingLabel>
                    <StatIcon>🔊</StatIcon>
                    Звуки
                  </SettingLabel>
                  <Switch 
                    on={settings.sounds} 
                    onClick={() => handleToggleSetting('sounds')}
                  />
                </SettingRow>
                
                <SettingRow>
                  <SettingLabel>
                    <StatIcon>🌙</StatIcon>
                    Темная тема
                  </SettingLabel>
                  <Switch 
                    on={settings.darkMode} 
                    onClick={() => handleToggleSetting('darkMode')}
                  />
                </SettingRow>
                
                <SettingRow>
                  <SettingLabel>
                    <StatIcon>🛡️</StatIcon>
                    Автоматическая защита
                  </SettingLabel>
                  <Switch 
                    on={settings.autoProtect} 
                    onClick={() => handleToggleSetting('autoProtect')}
                  />
                </SettingRow>
              </SettingsSection>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Аккаунт</CardTitle>
              </CardHeader>
              
              <div style={{ textAlign: 'center' }}>
                <LogoutButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                >
                  Выйти из аккаунта
                </LogoutButton>
              </div>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>О приложении</CardTitle>
              </CardHeader>
              
              <div style={{ padding: 'var(--spacing-sm) 0' }}>
                <div>ЭнергоГород</div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: 'var(--spacing-xs)' }}>
                  Версия 1.0.0
                </div>
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    © 2023 ЭнергоГород
                  </div>
                  <div style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>
                    Все права защищены
                  </div>
                </div>
              </div>
            </Card>
          </TabContent>
        )}
      </AnimatePresence>
    </ProfileContainer>
  );
};

export default UserProfile;

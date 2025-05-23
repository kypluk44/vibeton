import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for shop items
const shopItems = [
  {
    id: 'tokens-100',
    name: '100 токенов',
    description: 'Пакет из 100 токенов для развития вашего города',
    price: '49 ₽',
    icon: '💎',
    category: 'tokens',
    value: 100
  },
  {
    id: 'tokens-250',
    name: '250 токенов',
    description: 'Пакет из 250 токенов для развития вашего города',
    price: '99 ₽',
    icon: '💎',
    category: 'tokens',
    value: 250,
    popular: true
  },
  {
    id: 'tokens-500',
    name: '500 токенов',
    description: 'Пакет из 500 токенов для развития вашего города',
    price: '179 ₽',
    icon: '💎',
    category: 'tokens',
    value: 500
  },
  {
    id: 'discount-sports-10',
    name: '-10% на страховку от спортивных травм',
    description: 'Скидка на оформление полиса от спортивных травм',
    price: '30 токенов',
    icon: '🏋️',
    category: 'discount',
    discountValue: 10,
    forService: 'Sport Insurance'
  },
  {
    id: 'discount-car-15',
    name: '-15% на КАСКО',
    description: 'Скидка на оформление полиса КАСКО',
    price: '40 токенов',
    icon: '🚗',
    category: 'discount',
    discountValue: 15,
    forService: 'KASKO'
  },
  {
    id: 'skin-winter-house',
    name: 'Зимний домик',
    description: 'Уникальный зимний скин для вашего дома',
    price: '50 токенов',
    icon: '🏠❄️',
    category: 'skin',
    forBuilding: 'house',
    imageUrl: 'winter_house.png'
  },
  {
    id: 'skin-sport-premium',
    name: 'Премиум спортцентр',
    description: 'Современный дизайн для вашего спортцентра',
    price: '55 токенов',
    icon: '🏋️✨',
    category: 'skin',
    forBuilding: 'sportcenter',
    imageUrl: 'sport_premium.png'
  },
  {
    id: 'skin-luxury-car',
    name: 'Элитный автомобиль',
    description: 'Роскошный скин для вашего автомобиля',
    price: '45 токенов',
    icon: '🏎️',
    category: 'skin',
    forBuilding: 'car',
    imageUrl: 'luxury_car.png'
  },
];

// Styled Components
const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #8e1d41 0%, #420835 100%);
  padding: var(--spacing-md);
  padding-bottom: 80px;
  color: white;
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

const ShopHeader = styled.div`
  text-align: center;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
`;

const ShopTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
`;

const UserBalance = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: var(--spacing-xs) var(--spacing-sm);
  gap: var(--spacing-xs);
  font-weight: 500;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const CategoryTab = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: ${props => props.active ? '3px solid white' : 'none'};
  cursor: pointer;
`;

const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ShopItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  ${props => props.popular && `
    border: 2px solid var(--color-primary-light);
    
    &::after {
      content: "Популярный";
      position: absolute;
      top: 10px;
      right: -30px;
      background: var(--color-primary-light);
      color: white;
      transform: rotate(45deg);
      padding: 5px 35px;
      font-size: 0.7rem;
      font-weight: 600;
    }
  `}
`;

const ItemIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
  text-align: center;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: var(--spacing-xs);
`;

const ItemDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const BuyButton = styled(motion.button)`
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmationModal = styled(motion.div)`
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

const ConfirmationCard = styled(motion.div)`
  background: white;
  color: var(--color-text);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
`;

const ConfirmationTitle = styled.h2`
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
`;

const ConfirmationIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin: var(--spacing-lg) 0;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const ConfirmButton = styled(motion.button)`
  flex: 1;
  padding: var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled(motion.button)`
  flex: 1;
  padding: var(--spacing-md);
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-text-light);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
`;

const SuccessModal = styled(motion.div)`
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

const SuccessCard = styled(motion.div)`
  background: white;
  color: var(--color-text);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 5rem;
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

const TokenShop = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const filteredItems = activeCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === activeCategory);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleBuyClick = (item) => {
    setSelectedItem(item);
    setShowConfirmation(true);
  };
  
  const handleConfirmPurchase = () => {
    setShowConfirmation(false);
    
    // Update user data based on the purchased item
    if (selectedItem.category === 'tokens') {
      // For real money purchases, we'd integrate a payment gateway here
      // For demo, we'll just add the tokens
      updateUserData({
        tokens: userData.tokens + selectedItem.value
      });
    }
    else {
      // For token purchases
      const tokenPrice = parseInt(selectedItem.price, 10);
      
      if (userData.tokens >= tokenPrice) {
        // Process the purchase
        if (selectedItem.category === 'skin') {
          // Add skin to inventory
          const updatedInventory = [...(userData.inventory || []), {
            id: selectedItem.id,
            type: 'skin',
            name: selectedItem.name,
            forBuilding: selectedItem.forBuilding,
            icon: selectedItem.icon,
          }];
          
          updateUserData({
            tokens: userData.tokens - tokenPrice,
            inventory: updatedInventory
          });
        }
        else if (selectedItem.category === 'discount') {
          // Add discount to inventory
          const updatedInventory = [...(userData.inventory || []), {
            id: selectedItem.id,
            type: 'discount',
            name: selectedItem.name,
            value: selectedItem.discountValue,
            forService: selectedItem.forService,
            icon: selectedItem.icon,
          }];
          
          updateUserData({
            tokens: userData.tokens - tokenPrice,
            inventory: updatedInventory
          });
        }
      }
    }
    
    setShowSuccess(true);
  };
  
  const handleCancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedItem(null);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedItem(null);
    
    // For token purchases, we might want to navigate to the relevant page
    if (selectedItem && selectedItem.category === 'tokens') {
      navigate('/city');
    }
  };
  
  // Check if user can afford an item
  const canAfford = (item) => {
    if (item.category === 'tokens') {
      return true; // Assume user can afford real money purchases
    } else {
      const price = parseInt(item.price, 10);
      return userData.tokens >= price;
    }
  };
  
  return (
    <ShopContainer>
      <BackButton
        onClick={() => navigate('/city')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ←
      </BackButton>
      
      <ShopHeader>
        <ShopTitle>Магазин</ShopTitle>
        <UserBalance>
          <span role="img" aria-label="tokens">💎</span> {userData.tokens} токенов
        </UserBalance>
      </ShopHeader>
      
      <CategoryTabs>
        <CategoryTab
          active={activeCategory === 'all'}
          onClick={() => handleCategoryChange('all')}
        >
          Все
        </CategoryTab>
        <CategoryTab
          active={activeCategory === 'tokens'}
          onClick={() => handleCategoryChange('tokens')}
        >
          Токены
        </CategoryTab>
        <CategoryTab
          active={activeCategory === 'discount'}
          onClick={() => handleCategoryChange('discount')}
        >
          Скидки
        </CategoryTab>
        <CategoryTab
          active={activeCategory === 'skin'}
          onClick={() => handleCategoryChange('skin')}
        >
          Скины
        </CategoryTab>
      </CategoryTabs>
      
      <ShopGrid>
        {filteredItems.map(item => (
          <ShopItem
            key={item.id}
            popular={item.popular}
            whileHover={{ y: -5 }}
          >
            <ItemIcon>{item.icon}</ItemIcon>
            <ItemName>{item.name}</ItemName>
            <ItemDescription>{item.description}</ItemDescription>
            <ItemPrice>
              {item.category === 'tokens' ? (
                item.price
              ) : (
                <>
                  <span role="img" aria-label="tokens">💎</span> {item.price}
                </>
              )}
            </ItemPrice>
            <BuyButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBuyClick(item)}
              disabled={!canAfford(item)}
            >
              {canAfford(item) ? 'Купить' : 'Недостаточно токенов'}
            </BuyButton>
          </ShopItem>
        ))}
      </ShopGrid>
      
      <AnimatePresence>
        {showConfirmation && (
          <ConfirmationModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConfirmationCard
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <ConfirmationTitle>Подтвердите покупку</ConfirmationTitle>
              <ConfirmationIcon>{selectedItem?.icon}</ConfirmationIcon>
              
              <div>
                <strong>{selectedItem?.name}</strong>
                <p>{selectedItem?.description}</p>
                
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <strong>Стоимость:</strong> 
                  <div style={{ marginTop: 'var(--spacing-xs)' }}>
                    {selectedItem?.category === 'tokens' ? (
                      selectedItem?.price
                    ) : (
                      <>
                        <span role="img" aria-label="tokens">💎</span> {selectedItem?.price}
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <ConfirmationButtons>
                <CancelButton
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelPurchase}
                >
                  Отмена
                </CancelButton>
                <ConfirmButton
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmPurchase}
                >
                  Подтвердить
                </ConfirmButton>
              </ConfirmationButtons>
            </ConfirmationCard>
          </ConfirmationModal>
        )}
        
        {showSuccess && (
          <SuccessModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessCard
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <h2>Покупка успешна!</h2>
              
              <SuccessIcon>✨</SuccessIcon>
              
              {selectedItem?.category === 'tokens' ? (
                <p>Вы успешно приобрели {selectedItem.value} токенов!</p>
              ) : selectedItem?.category === 'skin' ? (
                <p>Вы успешно приобрели новый скин для вашего города!</p>
              ) : (
                <p>Вы успешно приобрели скидку на страховку!</p>
              )}
              
              <CloseButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseSuccess}
              >
                Продолжить
              </CloseButton>
            </SuccessCard>
          </SuccessModal>
        )}
      </AnimatePresence>
    </ShopContainer>
  );
};

export default TokenShop;

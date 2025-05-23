import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Mock story data
const storyChapters = [
  {
    id: 1,
    title: 'Новое начало',
    panels: [
      {
        image: '🌆',
        text: 'Эмма смотрела на участок земли, где скоро вырастет её ЭнергоГород. "Это мой шанс начать всё заново", - подумала она.',
      },
      {
        image: '🏠',
        text: 'Через месяц на участке уже стоял дом. Эмма гордилась своим первым зданием, но понимала - городу нужна защита.',
      },
      {
        image: '🌧️',
        text: 'Внезапно налетела гроза. "Что, если молния ударит в дом? Он ведь не застрахован..." - с тревогой подумала Эмма.',
      },
      {
        image: '📱',
        text: 'Она быстро открыла приложение и выбрала базовую страховку для дома. "Теперь можно спать спокойно", - улыбнулась она.',
      }
    ],
    choices: [
      { 
        text: 'Купить премиум-защиту',
        outcome: 'Эмма решила не экономить на безопасности. Премиум-полис защитил дом не только от стихийных бедствий, но и от кражи.',
        reward: { type: 'tokens', amount: 15 }
      },
      { 
        text: 'Обойтись базовой защитой',
        outcome: 'Эмма решила начать с малого. Базовая защита справилась с задачей, но через месяц в дом попытались проникнуть воры...',
        reward: { type: 'tokens', amount: 10 }
      },
    ],
    building: 'house',
    policy: 'home-basic',
    lifehack: 'Полис страхования имущества защищает не только от пожара и затопления, но и от многих других рисков. Всегда читайте, что входит в вашу страховку!'
  },
  {
    id: 2,
    title: 'Дорожные приключения',
    panels: [
      {
        image: '🚗',
        text: 'Город рос, и Эмме понадобился автомобиль. "Столько дел, без машины не успеть", - думала она, выбирая модель.',
      },
      {
        image: '🛒',
        text: 'Выбрав подходящий вариант, Эмма задумалась о страховке. "ОСАГО обязательно, но достаточно ли этого?"',
      },
      {
        image: '🌨️',
        text: 'По прогнозу надвигался сильный град. "Машину только купила, а она уже под угрозой", - беспокоилась Эмма.',
      },
      {
        image: '📊',
        text: 'Она сравнила варианты страхования и поняла, что КАСКО защитит от всех рисков, включая природные явления.',
      }
    ],
    choices: [
      { 
        text: 'Оформить КАСКО',
        outcome: 'Решение оказалось верным! Через неделю на город обрушился сильнейший град, но автомобиль Эммы был полностью возмещен страховкой.',
        reward: { type: 'tokens', amount: 20 }
      },
      { 
        text: 'Ограничиться ОСАГО',
        outcome: 'Эмма решила сэкономить... и пожалела. Град нанес серьезный ущерб машине, а ОСАГО покрывает только ответственность перед другими участниками движения.',
        reward: { type: 'tokens', amount: 5 }
      },
    ],
    building: 'car',
    policy: 'car-kasko',
    lifehack: 'ОСАГО покрывает только ущерб, который вы причинили другим участникам ДТП. Для защиты собственного автомобиля нужно КАСКО!'
  },
  {
    id: 3,
    title: 'Спортивный дух',
    panels: [
      {
        image: '🏋️',
        text: 'ЭнергоГород развивался, и Эмма решила построить спортивный центр. "Жителям нужно место для активного отдыха", - решила она.',
      },
      {
        image: '👷',
        text: 'Когда строительство завершилось, Эмма подумала о безопасности. "В спорте всегда есть риск травм. Нужна надежная защита".',
      },
      {
        image: '📋',
        text: 'Консультант предложил ей два варианта: базовую страховку от несчастных случаев и расширенную с защитой от ответственности.',
      },
      {
        image: '🤔',
        text: '"Если кто-то получит травму и подаст в суд, это может разорить центр", - размышляла Эмма, изучая предложения.',
      }
    ],
    choices: [
      { 
        text: 'Выбрать расширенную защиту',
        outcome: 'Предусмотрительность окупилась! Через месяц посетитель получил травму и хотел подать в суд, но страховка полностью покрыла лечение и компенсацию.',
        reward: { type: 'tokens', amount: 25 }
      },
      { 
        text: 'Взять только базовую защиту',
        outcome: 'Эмма сэкономила, но рискнула. К счастью, серьезных травм не произошло, но она постоянно беспокоилась о возможных судебных исках.',
        reward: { type: 'tokens', amount: 10 }
      },
    ],
    building: 'sportcenter',
    policy: 'sport-premium',
    lifehack: 'Страховка ответственности для бизнеса защищает от судебных исков клиентов и может спасти от банкротства в случае серьезных инцидентов.'
  },
  {
    id: 4,
    title: 'Небесные путешествия',
    panels: [
      {
        image: '✈️',
        text: 'ЭнергоГород стал настолько важным, что понадобился собственный аэропорт. "Теперь мы соединены со всем миром", - радовалась Эмма.',
      },
      {
        image: '🧳',
        text: 'Планируя первое путешествие, Эмма вспомнила о друге, который потерял багаж в поездке. "Стоит подумать о страховке путешествий".',
      },
      {
        image: '⛈️',
        text: 'Прогноз погоды для первого рейса был неутешительным. "Рейс могут задержать или даже отменить из-за шторма", - беспокоилась она.',
      },
      {
        image: '📊',
        text: 'Эмма сравнила базовую и премиум страховку путешествий. Премиум версия покрывала не только задержки, но и отмены рейсов, потерю багажа и медицинские расходы.',
      }
    ],
    choices: [
      { 
        text: 'Выбрать премиум страховку',
        outcome: 'Интуиция не подвела! Рейс отменили из-за шторма, но страховка полностью возместила стоимость билетов и оплатила комфортное размещение в отеле.',
        reward: { type: 'tokens', amount: 30 }
      },
      { 
        text: 'Взять базовую страховку',
        outcome: 'Базовая страховка частично покрыла расходы на новый билет, но Эмма потеряла время и немного денег. В следующий раз она решила не экономить на комфорте.',
        reward: { type: 'tokens', amount: 15 }
      },
    ],
    building: 'airport',
    policy: 'travel-premium',
    lifehack: 'Хорошая туристическая страховка покрывает не только медицинские расходы, но и задержки транспорта, потерю багажа и даже отмену поездки по уважительным причинам!'
  }
];

// Styled Components
const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #2b1a27;
  color: white;
  max-width: 100%;
  overflow-x: hidden;
  padding-bottom: 80px;
`;

const StoryHeader = styled.div`
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ChapterTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: var(--spacing-sm);
  color: white;
`;

const ComicStrip = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
`;

const ComicPanel = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius-md);
  margin: 0 var(--spacing-lg);
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const PanelImage = styled.div`
  background: #f5f5f5;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
`;

const PanelText = styled.div`
  color: var(--color-text);
  padding: var(--spacing-md);
  font-size: 1rem;
  line-height: 1.5;
`;

const ChoiceContainer = styled.div`
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
`;

const ChoiceTitle = styled.h2`
  margin-bottom: var(--spacing-lg);
`;

const ChoiceButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ChoiceButton = styled(motion.button)`
  padding: var(--spacing-md);
  background: ${props => props.primary ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'white'};
  border: 2px solid ${props => props.primary ? 'var(--color-primary)' : 'white'};
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;

const OutcomeContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) var(--spacing-md);
`;

const OutcomeText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
`;

const RewardBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const RewardIcon = styled.span`
  font-size: 2rem;
`;

const LifehackContainer = styled(motion.div)`
  background: rgba(142, 29, 65, 0.3);
  border-left: 4px solid var(--color-primary);
  padding: var(--spacing-md);
  margin: var(--spacing-lg) var(--spacing-md);
`;

const LifehackTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary-light);
`;

const LifehackText = styled.p`
  line-height: 1.5;
  font-size: 0.95rem;
`;

const ContinueButton = styled(motion.button)`
  padding: var(--spacing-md) var(--spacing-xl);
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  margin-top: var(--spacing-lg);
  cursor: pointer;
  align-self: center;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  cursor: pointer;
  z-index: 10;
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(5px);
  cursor: pointer;
  z-index: 10;
  left: ${props => props.direction === 'prev' ? 'var(--spacing-md)' : 'auto'};
  right: ${props => props.direction === 'next' ? 'var(--spacing-md)' : 'auto'};
`;

const Progress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.percentage}%;
  height: 4px;
  background: var(--color-primary);
  z-index: 20;
  transition: width 0.3s ease;
`;

const StoryChapter = ({ userData, updateUserData }) => {
  const { chapter } = useParams();
  const navigate = useNavigate();
  
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showLifehack, setShowLifehack] = useState(false);
  
  useEffect(() => {
    // Find the chapter data
    const chapterData = storyChapters.find(c => c.id === parseInt(chapter, 10));
    
    if (chapterData) {
      setCurrentChapter(chapterData);
    } else {
      // If chapter not found, redirect to the first chapter
      navigate('/story/1');
    }
  }, [chapter, navigate]);
  
  const handleNextPanel = () => {
    if (currentPanelIndex < currentChapter.panels.length - 1) {
      setCurrentPanelIndex(prevIndex => prevIndex + 1);
    } else {
      // Show choices when all panels are viewed
      setShowChoices(true);
    }
  };
  
  const handlePrevPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSelectChoice = (choice, index) => {
    setSelectedChoice(choice);
    setShowChoices(false);
    setShowOutcome(true);
    
    // Apply rewards
    if (choice.reward) {
      if (choice.reward.type === 'tokens') {
        updateUserData({
          tokens: userData.tokens + choice.reward.amount
        });
      }
      // Add more reward types here as needed
    }
  };
  
  const handleContinueAfterOutcome = () => {
    setShowOutcome(false);
    setShowLifehack(true);
    
    // Mark chapter as completed in user data
    const completedChapters = userData.story?.completedChapters || [];
    if (!completedChapters.includes(parseInt(chapter, 10))) {
      updateUserData({
        story: {
          ...userData.story,
          completedChapters: [...completedChapters, parseInt(chapter, 10)],
          currentChapter: parseInt(chapter, 10) + 1
        }
      });
    }
  };
  
  const handleFinishChapter = () => {
    // Navigate to the next chapter or back to the city
    if (parseInt(chapter, 10) < storyChapters.length) {
      navigate(`/story/${parseInt(chapter, 10) + 1}`);
    } else {
      navigate('/city');
    }
  };
  
  if (!currentChapter) {
    return null; // Loading or chapter not found
  }
  
  // Calculate progress percentage
  const totalProgress = currentChapter.panels.length + 2; // panels + choices + outcome
  let currentProgress = currentPanelIndex + 1;
  
  if (showChoices) currentProgress = currentChapter.panels.length + 1;
  if (showOutcome) currentProgress = currentChapter.panels.length + 2;
  if (showLifehack) currentProgress = totalProgress;
  
  const progressPercentage = (currentProgress / totalProgress) * 100;
  
  return (
    <StoryContainer>
      <Progress percentage={progressPercentage} />
      
      <BackButton
        onClick={() => navigate('/city')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ×
      </BackButton>
      
      <StoryHeader>
        <ChapterTitle>Глава {chapter}: {currentChapter.title}</ChapterTitle>
      </StoryHeader>
      
      <AnimatePresence mode="wait">
        {!showChoices && !showOutcome && !showLifehack && (
          <ComicStrip
            key="comic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ComicPanel
              key={`panel-${currentPanelIndex}`}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <PanelImage>
                {currentChapter.panels[currentPanelIndex].image}
              </PanelImage>
              <PanelText>
                {currentChapter.panels[currentPanelIndex].text}
              </PanelText>
            </ComicPanel>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-md)' }}>
              {currentPanelIndex > 0 && (
                <NavigationButton
                  direction="prev"
                  onClick={handlePrevPanel}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ←
                </NavigationButton>
              )}
              
              <NavigationButton
                direction="next"
                onClick={handleNextPanel}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </NavigationButton>
            </div>
          </ComicStrip>
        )}
        
        {showChoices && (
          <ChoiceContainer
            key="choices"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ChoiceTitle>Что сделает героиня?</ChoiceTitle>
            
            <ChoiceButtons>
              {currentChapter.choices.map((choice, index) => (
                <ChoiceButton
                  key={index}
                  primary={index === 0}
                  onClick={() => handleSelectChoice(choice, index)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {choice.text}
                </ChoiceButton>
              ))}
            </ChoiceButtons>
          </ChoiceContainer>
        )}
        
        {showOutcome && (
          <OutcomeContainer
            key="outcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <OutcomeText>{selectedChoice.outcome}</OutcomeText>
            
            {selectedChoice.reward && (
              <RewardBox>
                <RewardIcon>
                  {selectedChoice.reward.type === 'tokens' ? '💎' : '⭐'}
                </RewardIcon>
                <div>
                  <strong>Награда</strong>
                  <div>
                    {selectedChoice.reward.type === 'tokens' 
                      ? `+${selectedChoice.reward.amount} токенов` 
                      : selectedChoice.reward.description}
                  </div>
                </div>
              </RewardBox>
            )}
            
            <div style={{ textAlign: 'center' }}>
              <ContinueButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinueAfterOutcome}
              >
                Продолжить
              </ContinueButton>
            </div>
          </OutcomeContainer>
        )}
        
        {showLifehack && (
          <LifehackContainer
            key="lifehack"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <LifehackTitle>
              <span>💡</span> Совет от страховых экспертов
            </LifehackTitle>
            
            <LifehackText>
              {currentChapter.lifehack}
            </LifehackText>
            
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
              <ContinueButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinishChapter}
              >
                {parseInt(chapter, 10) < storyChapters.length 
                  ? 'Следующая глава' 
                  : 'Вернуться в город'}
              </ContinueButton>
            </div>
          </LifehackContainer>
        )}
      </AnimatePresence>
    </StoryContainer>
  );
};

export default StoryChapter;

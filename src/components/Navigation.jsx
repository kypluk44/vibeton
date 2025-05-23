import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-md) 0;
  z-index: 100;

  @media (min-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 80px;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-xl) var(--spacing-sm);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const MenuItems = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: 768px) {
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
    gap: var(--spacing-xl);
  }
`;

const MenuItem = styled.li`
  text-align: center;
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-light);
  font-size: 0.75rem;
  padding: var(--spacing-xs);
  transition: all 0.2s ease;

  &.active {
    color: var(--color-primary);
  }

  &:hover {
    transform: translateY(-2px);
  }

  svg {
    margin-bottom: var(--spacing-xs);
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    svg {
      font-size: 1.75rem;
    }
  }
`;

const NavText = styled.span`
  display: block;
  
  @media (min-width: 768px) {
    opacity: 0;
    position: absolute;
    left: 100%;
    background: var(--color-primary);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-md);
    transform: translateX(8px);
    transition: opacity 0.2s ease;
    pointer-events: none;
    
    ${NavItem}:hover & {
      opacity: 1;
    }
  }
`;

// Simple SVG icon components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const ChecklistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Badge indicator for notifications
const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

const IconWrapper = styled.div`
  position: relative;
`;

const Navigation = ({ userData }) => {
  const location = useLocation();
  
  // Simple notifications system (for demo purposes)
  const notificationCount = {
    city: 0,
    story: userData?.story?.unreadChapters?.length || 0,
    quests: 1,  // Always show 1 quest notification for demo
    profile: 0
  };
  
  return (
    <NavContainer>
      <MenuItems>
        <MenuItem>
          <NavItem to="/city" className={location.pathname === '/city' ? 'active' : ''}>
            <IconWrapper>
              <HomeIcon />
              {notificationCount.city > 0 && <Badge>{notificationCount.city}</Badge>}
            </IconWrapper>
            <NavText>Город</NavText>
          </NavItem>
        </MenuItem>
        
        <MenuItem>
          <NavItem to="/story/1" className={location.pathname.includes('/story') ? 'active' : ''}>
            <IconWrapper>
              <BookIcon />
              {notificationCount.story > 0 && <Badge>{notificationCount.story}</Badge>}
            </IconWrapper>
            <NavText>Сюжеты</NavText>
          </NavItem>
        </MenuItem>
        
        <MenuItem>
          <NavItem to="/social/raid" className={location.pathname.includes('/social') ? 'active' : ''}>
            <IconWrapper>
              <TrophyIcon />
            </IconWrapper>
            <NavText>Лидеры</NavText>
          </NavItem>
        </MenuItem>
        
        <MenuItem>
          <NavItem to="/wheel" className={location.pathname === '/wheel' ? 'active' : ''}>
            <IconWrapper>
              <ChecklistIcon />
              {notificationCount.quests > 0 && <Badge>{notificationCount.quests}</Badge>}
            </IconWrapper>
            <NavText>Квесты</NavText>
          </NavItem>
        </MenuItem>
        
        <MenuItem>
          <NavItem to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            <IconWrapper>
              <UserIcon />
              {notificationCount.profile > 0 && <Badge>{notificationCount.profile}</Badge>}
            </IconWrapper>
            <NavText>Профиль</NavText>
          </NavItem>
        </MenuItem>
      </MenuItems>
    </NavContainer>
  );
};

export default Navigation;

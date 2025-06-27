import React, { createContext, useContext } from 'react';

interface AuthNavigationContextData {
  navigateToCadastro: () => void;
  navigateToLogin: () => void;
}

const AuthNavigationContext = createContext<AuthNavigationContextData | null>(null);

export const useAuthNavigation = () => {
  const context = useContext(AuthNavigationContext);
  if (!context) {
    throw new Error('useAuthNavigation deve ser usado dentro de AuthNavigationProvider');
  }
  return context;
};

export { AuthNavigationContext }; 
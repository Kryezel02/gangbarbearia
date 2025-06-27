import React from 'react';
import SideMenu from './SideMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {children}
      <SideMenu />
    </>
  );
} 
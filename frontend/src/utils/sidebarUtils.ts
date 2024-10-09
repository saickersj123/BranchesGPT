// src/utils/sidebarUtils.ts

export const saveSidebarState = (isOpen: boolean): void => {
    localStorage.setItem('sidebarState', isOpen ? 'open' : 'closed');
  };
  
  export const loadSidebarState = (): boolean => {
    const state = localStorage.getItem('sidebarState');
    return state === 'open';
  };
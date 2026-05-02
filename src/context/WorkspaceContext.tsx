import React, {createContext, useContext} from 'react';
import {useWorkspaceData} from '../hooks/useWorkspaceData';

type WorkspaceContextValue = ReturnType<typeof useWorkspaceData>;

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({children}: {children: React.ReactNode}) {
  const value = useWorkspaceData();
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider');
  }
  return value;
}

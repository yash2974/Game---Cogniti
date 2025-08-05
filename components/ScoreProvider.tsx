import React, { createContext, useContext, useState, ReactNode } from 'react';

type ScoreContextType = {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
};

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) throw new Error('useScore must be used within a ScoreProvider');
  return context;
};

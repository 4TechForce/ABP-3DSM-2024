import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type CalorieProgressProps = {
  goal: number; // Meta de calorias
  current: number; // Calorias ingeridas atualmente
};

const CalorieProgress: React.FC<CalorieProgressProps> = ({ goal, current }) => {
  // Calcula a porcentagem com base nas calorias atuais e na meta
  const percentage = (current / goal) * 100;

  return (
    <div style={{ width: 200, margin: 'auto' }}>
      <h2>Progresso de Calorias</h2>
      <CircularProgressbar
        value={percentage}
        text={`${Math.round(percentage)}%`}
        styles={buildStyles({
          textColor: '#fff',
          pathColor: '#ff007f',
          trailColor: '#333',
        })}
      />
      <p>
        Você ingeriu {current} de {goal} calorias
      </p>
    </div>
  );
};

export default CalorieProgress;

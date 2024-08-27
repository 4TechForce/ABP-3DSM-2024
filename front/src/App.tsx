import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0 }}>
      <img 
      src={`${process.env.PUBLIC_URL}/imagens/construcao.jpg`} 
      alt="Em construção" 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

export default App;

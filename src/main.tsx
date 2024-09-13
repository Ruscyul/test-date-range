import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './utils/dayjs.js';
import App from './App.tsx';
import './index.css';

import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {},
        components: {
          Slider: {
            handleColor: '#5cadea',
            handleLineWidth: 4,
            railSize: 6,
            railBg: '#edf1f8',
            trackBg: '#5cadea',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);

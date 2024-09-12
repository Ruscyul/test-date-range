import dayjs from 'dayjs';
import DateRange from './components/DateRange';
import './App.css';
import { useState } from 'react';

function App() {
  const [selectedMode, setSelectedMode] = useState<'months' | 'years'>('months');

  return (
    <>
      <div className="container">
        <div className="app">
          <div className="mode-switcher">
            <div
              onClick={() => setSelectedMode('years')}
              className={selectedMode === 'years' ? '' : 'mode--not-selected'}
            >
              Все года
            </div>
            <div
              onClick={() => setSelectedMode('months')}
              className={selectedMode === 'months' ? '' : 'mode--not-selected'}
            >
              Месяца
            </div>
          </div>
          <DateRange
            mode={selectedMode}
            minDate={dayjs('01-01-2015')}
            maxDate={dayjs('01-01-2017')}
            startDate={dayjs('05-01-2015')}
            endDate={dayjs('02-01-2016')}
          />
        </div>
      </div>
    </>
  );
}

export default App;

import dayjs from 'dayjs';
import DateRange from './components/DateRange';

function App() {
  return (
    <>
      <DateRange minDate={dayjs('01-01-2021')} maxDate={dayjs('12-31-2022')} />
    </>
  );
}

export default App;

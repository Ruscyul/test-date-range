import { Slider, SliderSingleProps } from 'antd';
import { Dayjs } from 'dayjs';
import './DateRange.css';

interface DateRangeProps {
  mode: 'months' | 'years';
  minDate: Dayjs;
  maxDate: Dayjs;
  startDate: Dayjs;
  endDate: Dayjs;
}

const DateRange = (props: DateRangeProps) => {
  const { mode, minDate, maxDate, startDate, endDate } = props;

  const totalMonths = maxDate.diff(minDate, 'month');

  const startMonth = startDate.diff(minDate, 'month') + 1;
  const endMonth = endDate.diff(minDate, 'month') + 1;

  const getDateTooltip = (minDate: Dayjs, step: number) => {
    const newDate = minDate.add(step, 'month');
    return (
      <>
        {newDate.format('MMMM')} <br /> {newDate.format('YYYY')}
      </>
    );
  };
  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => getDateTooltip(minDate, value);

  const getDateMarks = (minDate: Dayjs) => {
    const marks = {};

    for (let i = 0; i <= totalMonths; i++) {
      const currentDate = minDate.add(i, 'month');

      if (currentDate.month() === 0) {
        marks[i] = currentDate.format('YYYY');
        if (mode === 'months') {
          marks[i] = {
            style: {
              color: 'rgba(0, 0, 0, 0.88)',
            },
            label: <span>{currentDate.format('YYYY')}</span>,
          };
        }
      } else if (mode === 'months') {
        marks[i] = currentDate.format('MMM');
      }
    }

    return marks;
  };
  const marks: SliderSingleProps['marks'] = getDateMarks(minDate);

  return (
    <div className="date-range-container">
      <Slider
        range
        min={0}
        max={totalMonths}
        defaultValue={[startMonth, endMonth]}
        tooltip={{
          formatter,
          open: true,
          color: 'white',
          overlayInnerStyle: {
            textAlign: 'center',
            fontWeight: '500',
            color: '#0167b3',
          },
        }}
        marks={marks}
      />
    </div>
  );
};

export default DateRange;

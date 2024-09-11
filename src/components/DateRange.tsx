import { Slider, SliderSingleProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface DateRangeProps {
  mode: string;
  minDate: Dayjs;
  maxDate: Dayjs;
  startDate: string;
  endDate: string;
}

const DateRange = (props: DateRangeProps) => {
  const { mode, minDate, maxDate, startDate, endDate } = props;

  const totalMonths = maxDate.diff(minDate, 'month');

  const getDateTooltip = (minDate: Dayjs, step: number) => {
    const newDate = minDate.add(step, 'month');
    return newDate.format('MMMM YYYY');
  };
  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => getDateTooltip(minDate, value);

  const getDateMarks = (minDate: Dayjs) => {
    const marks = {};
    for (let i = 0; i <= totalMonths; i++) {
      marks[i] = minDate.add(i, 'month').format('MMM');
    }
    return marks;
  };
  const marks: SliderSingleProps['marks'] = getDateMarks(minDate);

  return (
    <>
      <Slider
        range
        min={0}
        max={totalMonths}
        defaultValue={[startDate, endDate]}
        tooltip={{ formatter }}
        marks={marks}
      />
    </>
  );
};

export default DateRange;

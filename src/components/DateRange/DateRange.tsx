import { Slider, SliderSingleProps } from 'antd';
import { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
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

  const rangeContainerRef = useRef<HTMLDivElement>(null);
  const [rangeContainerWidth, setRangeContainerWidth] = useState<number>(0);

  const totalMonths = maxDate.diff(minDate, 'month');
  const startMonth = startDate.diff(minDate, 'month');
  const endMonth = endDate.diff(minDate, 'month');

  const getMarkStep = (totalMonths: number, containerWidth: number) => {
    const markWidth = 32;
    const totalSpaceNeeded = totalMonths * markWidth;

    if (containerWidth >= totalSpaceNeeded) {
      return 1;
    } else {
      const visibleMarks = Math.floor(containerWidth / markWidth);
      return Math.ceil(totalMonths / visibleMarks);
    }
  };

  const getDateTooltip = (minDate: Dayjs, step: number) => {
    const newDate = minDate.add(step, 'month');
    return (
      <>
        {newDate.format('MMMM')} <br /> {newDate.format('YYYY')}
      </>
    );
  };

  const getDateMarks = (minDate: Dayjs, totalMonths: number) => {
    const marks: Record<number, string | { style: object; label: JSX.Element }> = {};

    const step = getMarkStep(totalMonths, rangeContainerWidth);

    for (let i = 0; i <= totalMonths; i++) {
      const currentDate = minDate.add(i, 'month');

      if (currentDate.month() === 0) {
        if (mode === 'months') {
          marks[i] = {
            style: {
              color: 'rgba(0, 0, 0, 0.88)',
            },
            label: <span>{currentDate.format('YYYY')}</span>,
          };
        } else {
          marks[i] = currentDate.format('YYYY');
        }
      } else if (mode === 'months' && i % step === 0) {
        marks[i] = currentDate.format('MMM');
      }
    }

    return marks;
  };

  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => {
    if (value !== undefined) {
      return getDateTooltip(minDate, value);
    }
    return null;
  };
  const marks: SliderSingleProps['marks'] = getDateMarks(minDate, totalMonths);

  const updateRangeContainerWidth = () => {
    if (rangeContainerRef.current) {
      const width = rangeContainerRef.current.getBoundingClientRect().width;
      setRangeContainerWidth(width);
    }
  };

  useEffect(() => {
    updateRangeContainerWidth();
    window.addEventListener('resize', updateRangeContainerWidth);

    return () => {
      window.removeEventListener('resize', updateRangeContainerWidth);
    };
  }, []);

  return (
    <div className="date-range-container" ref={rangeContainerRef}>
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

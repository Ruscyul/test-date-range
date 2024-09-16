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

  const MARK_WIDTH = 35;

  const rangeContainerRef = useRef<HTMLDivElement>(null);
  const [rangeContainerWidth, setRangeContainerWidth] = useState<number>(0);

  const totalMonths = maxDate.diff(minDate, 'month');
  const totalYears = maxDate.diff(minDate, 'years');
  const startMonth = startDate.diff(minDate, 'month');
  const endMonth = endDate.diff(minDate, 'month');

  const getMarkStep = (totalMonths: number, containerWidth: number) => {
    const totalSpaceNeeded = totalMonths * MARK_WIDTH;
    let step;

    if (containerWidth >= totalSpaceNeeded) {
      step = 1;
      return step;
    } else {
      const visibleMarks = Math.floor(containerWidth / MARK_WIDTH);
      step = Math.ceil(totalMonths / visibleMarks);
      if (step % 2 === 0) {
        return step;
      } else {
        return step + 1;
      }
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

    const yearStep = getMarkStep(totalYears, rangeContainerWidth);
    const monthStep = getMarkStep(totalMonths, rangeContainerWidth);

    const styleYearMark = (date: Dayjs) => {
      return {
        style: {
          color: 'rgba(0, 0, 0, 0.88)',
        },
        label: <span>{date.format('YYYY')}</span>,
      };
    };

    for (let i = 0; i <= totalMonths; i++) {
      const currentDate = minDate.add(i, 'month');

      if (mode === 'months') {
        if (monthStep === 1) {
          if (currentDate.month() === 0) {
            marks[i] = styleYearMark(currentDate);
          } else {
            marks[i] = currentDate.format('MMM');
          }
        } else if (monthStep > 1 && monthStep <= 6) {
          if (currentDate.month() === 0) {
            marks[i] = styleYearMark(currentDate);
          } else if (i % monthStep === 0) {
            marks[i] = currentDate.format('MMM');
          }
        } else if (monthStep > 6 && yearStep > 1) {
          if (i === 0 || i === totalMonths) {
            marks[i] = styleYearMark(currentDate);
          } else if (currentDate.month() === 0 && i % (yearStep * 12) === 0) {
            marks[i] = styleYearMark(currentDate);
          }
        } else if (monthStep > 6) {
          if (currentDate.month() === 0) {
            marks[i] = styleYearMark(currentDate);
          }
        }
      } else if (mode === 'years') {
        if (yearStep === 1) {
          if (currentDate.month() === 0) {
            marks[i] = currentDate.format('YYYY');
          }
        } else {
          if (currentDate.month() === 0 && i % (yearStep * 12) === 0) {
            marks[i] = currentDate.format('YYYY');
          }
        }
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

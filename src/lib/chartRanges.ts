import { differenceInDays, differenceInHours, differenceInMonths, differenceInWeeks, eachDayOfInterval, eachHourOfInterval, eachMonthOfInterval, eachWeekOfInterval, eachYearOfInterval, endOfDay, endOfWeek, interval, isSameWeek, isValid, max, min, startOfDay, startOfWeek, subDays } from "date-fns";
import { dateFormat, hourFormat, monthFormat, timeFormat, weekFormat, weekMonthFormat, yearFormat } from "./formaters";

export const CHART_RANGES = {
  current_day: {
    label: 'Current Day',
    startDate: startOfDay(subDays(new Date(), 0)),
    endDate: null
  },
  last_day: {
    label: 'Last Day',
    startDate: startOfDay(subDays(new Date(), 1)),
    endDate: endOfDay(subDays(new Date(), 1))
  },
  last_7_days: {
    label: 'Last 7 Days',
    startDate: startOfDay(subDays(new Date(), 6)),
    endDate: new Date()
  },
  last_30_days: {
    label: 'Last 30 Days',
    startDate: startOfDay(subDays(new Date(), 29)),
    endDate: new Date()
  },
  last_90_days: {
    label: 'Last 90 Days',
    startDate: startOfDay(subDays(new Date(), 89)),
    endDate: new Date()
  },
  last_365_days: {
    label: 'Last 365 Days',
    startDate: startOfDay(subDays(new Date(), 364)),
    endDate: new Date()
  },
  all_time: {
    label: 'All Time',
    startDate: null,
    endDate: null
  },
}


export function getChartRangeData({staticRange, CalendarRangeFrom, CalendarRangeTo}: {staticRange?: string, CalendarRangeFrom?: string, CalendarRangeTo?: string}){
  if (!staticRange) {

    if (!CalendarRangeTo || !CalendarRangeFrom) return

    const startDate = new Date(CalendarRangeFrom)
    const endDate = new Date(CalendarRangeTo)

    if (!isValid(startDate) || !isValid(endDate)) return

    return {
      label: `${dateFormat(startDate)} - ${dateFormat(endDate)}`,
      startDate: startOfDay(startDate),
      endDate: endOfDay(endDate)
    }
  }

  return CHART_RANGES[staticRange as keyof typeof CHART_RANGES]
}


export function getChartRangeDate(startDate: Date, endDate: Date = new Date()) {
  const hours = differenceInHours(endDate, startDate)
  if (hours < 24) {
    return {
      dateArray: eachHourOfInterval(interval(startDate, endDate)),
      format: hourFormat
    }
  }

  const days = differenceInDays(endDate, startDate)
  if (days < 7) {
    if (isSameWeek(new Date, startDate) && isSameWeek(new Date, endDate)) {
      return {
        dateArray: eachDayOfInterval(interval(startDate, endDate)),
        format: weekFormat
      }
    }
    return {
      dateArray: eachDayOfInterval(interval(startDate, endDate)),
      format: weekMonthFormat
    }
  }

  if (days < 30) {
    return {
      dateArray: eachDayOfInterval(interval(startDate, endDate)),
      format: dateFormat
    }
  }

  const weeks = differenceInWeeks(endDate, startDate)
  if (weeks < 30) {
    return {
      dateArray: eachWeekOfInterval(interval(startDate, endDate)),
      format: (date: Date) => {
        const startDay = max([startOfWeek(date), startDate])
        const endDay = min([endOfWeek(date), endDate])
        return `${dateFormat(startDay)} - ${dateFormat(endDay)}`
      }
    }
  }

  const months = differenceInMonths(endDate, startDate)
  if (months < 30 ) {
    return {
      dateArray: eachMonthOfInterval(interval(startDate, endDate)),
      format: monthFormat
    }
  }

  return {
    dateArray: eachYearOfInterval(interval(startDate, endDate)),
    format: yearFormat
  }
}
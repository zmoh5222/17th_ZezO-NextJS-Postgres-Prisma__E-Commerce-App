


// currency format
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0
})

export function currencyFormat(price: number) {
  return CURRENCY_FORMATTER.format(price)
}

// number format
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function numberFormat(number: number) {
  return NUMBER_FORMATTER.format(number)
}

// percent number format
const PERCENT_NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'percent'
})

export function percentNumberFormat(number: number) {
  return PERCENT_NUMBER_FORMATTER.format(number / 100)
}

// date format
const DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium'
})

export function dateFormat(date: Date) {
  return DATE_FORMATTER.format(date)
}

// date-time format
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

export function dateTimeFormat(date: Date) {
  return DATE_TIME_FORMATTER.format(date)
}


// hour-minute format
const TIME_FORMATTER = new Intl.DateTimeFormat('en', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
})

export function timeFormat(date: Date) {
  return TIME_FORMATTER.format(date)
}


// hour-minute format
const HOUR_FORMATTER = new Intl.DateTimeFormat('en', {
  hour: '2-digit',
  hour12: true
})

export function hourFormat(date: Date) {
  return HOUR_FORMATTER.format(date)
}


// week format
const WEEK_FORMATTER = new Intl.DateTimeFormat('en', {
  weekday: 'short'
})

export function weekFormat(date: Date) {
  return WEEK_FORMATTER.format(date)
}


// week-month format
const WEEK_MONTH_FORMATTER = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
  year: '2-digit'
})

export function weekMonthFormat(date: Date) {
  return WEEK_MONTH_FORMATTER.format(date)
}


// month format
const MONTH_FORMATTER = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric'
})

export function monthFormat(date: Date) {
  return MONTH_FORMATTER.format(date)
}


// year format
const YEAR_FORMATTER = new Intl.DateTimeFormat('en', {
  year: 'numeric'
})

export function yearFormat(date: Date) {
  return YEAR_FORMATTER.format(date)
}

// remaining time format
const REMAINING_TIME_FORMATTER = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto'
})

export function remainingTimeWithIntl(endDate: Date) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return REMAINING_TIME_FORMATTER.format(diff < 0 ? -years : years, 'year');
  }
  if (months > 0) {
    return REMAINING_TIME_FORMATTER.format(diff < 0 ? -months : months, 'month');
  }
  if (weeks > 0) {
    return REMAINING_TIME_FORMATTER.format(diff < 0 ? -weeks : weeks, 'week');
  }
  if (days > 0) {
    return REMAINING_TIME_FORMATTER.format(diff < 0 ? -days : days, 'day');
  }
  if (hours > 0) {
    return REMAINING_TIME_FORMATTER.format(diff < 0 ? -hours : hours, 'hour');
  }
  if (minutes > 0) {
    return REMAINING_TIME_FORMATTER.format(diff < 0 ? -minutes : minutes, 'minute');
  }
  return REMAINING_TIME_FORMATTER.format(diff < 0 ? -seconds : seconds, 'second');
}
import { formatDistanceToNowStrict } from "date-fns";

export default function remainingTimeWithDateFns(endDate: Date) {
  return formatDistanceToNowStrict(new Date(endDate), { addSuffix: true });
}
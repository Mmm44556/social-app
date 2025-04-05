import { formatDistance, parseISO, differenceInDays, format } from "date-fns";

export default function formatTimeOrDate(dateString: Date) {
  const date = parseISO(dateString.toISOString());
  const now = new Date();
  const daysDifference = differenceInDays(now, date);

  if (daysDifference > 5) {
    // 如果超過五天，顯示具體日期，格式為 "yyyy-MM-dd"
    return format(date, "yyyy-MM-dd");
  } else {
    // 否則顯示距離現在有多久
    return formatDistance(date, now, { addSuffix: true });
  }
}

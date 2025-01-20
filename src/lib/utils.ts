import { format } from "date-fns"
import type { calendar_v3 } from "googleapis"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getRecurrencePeriod(event: calendar_v3.Schema$Event): string {
  if (!event.recurrence) return "unknown"

  const recurrenceRule = event.recurrence[0]
  if (recurrenceRule.includes("DAILY")) return "daily"
  if (recurrenceRule.includes("WEEKLY")) return "weekly"
  if (recurrenceRule.includes("MONTHLY")) return "monthly"
  if (recurrenceRule.includes("YEARLY")) return "yearly"

  return "custom"
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "N/A"
  return format(new Date(dateString), "PPP p")
}


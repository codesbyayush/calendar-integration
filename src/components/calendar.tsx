"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DateRangePicker } from "./date-range-picker"
import { EventTable } from "./event-table"
import { Plus } from "lucide-react"
import { startOfToday } from "date-fns"
import type { calendar_v3 } from "googleapis"
import { getCalendarEvents } from "@/actions/calender"
import next from "next"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

export const MAX_PAGE_SIZE = 10
export function Calendar() {
  const user = useSession()
  const [events, setEvents] = useState<calendar_v3.Schema$Event[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date | null }>({
    start: startOfToday(),
    end: null,
  })
  const [pageToken, setPageToken] = useState<string | null>()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nextAvailable, setNextAvailable] = useState<boolean>(false)

  async function fetchDataForDateRange() {
    setIsLoading(true)
    const params: any = {}
    if (dateRange.start) {
      params.startDate = dateRange.start.toISOString()
    }
    if (dateRange.end) {
      params.endDate = dateRange.end.toISOString()
    }

    try {
      const { events: newEvents, nextPageToken: newNextPageToken, hasNext } = await getCalendarEvents({ ...params })
      setEvents(newEvents)
      setPageToken(newNextPageToken || null)
      setCurrentPage(0)
      setNextAvailable(hasNext)
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Fetch error:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchNextPage(e: React.MouseEvent<HTMLButtonElement>) {
    if (!pageToken) return
    e.preventDefault()
    setIsLoading(true)
    console.log(nextAvailable)
    const params: any = {
      pageToken,
    }
    if (dateRange.start) {
      params.startDate = dateRange.start.toISOString()
    }
    if (dateRange.end) {
      params.endDate = dateRange.end.toISOString()
    }

    try {
      const { events: newEvents, nextPageToken: newNextPageToken, hasNext } = await getCalendarEvents({ ...params })
      setEvents((prev) => [...prev, ...newEvents])
      setPageToken(newNextPageToken || null)
      setCurrentPage((prev) => prev + 1)
      setNextAvailable(hasNext)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Fetch error:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateRangeChange = useCallback((start: Date, end: Date | null) => {
    setDateRange({ start, end })
  }, [])

  useEffect(() => {
    fetchDataForDateRange()
  }, [dateRange])

  const totalPages = Math.ceil(events.length / MAX_PAGE_SIZE)

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Calendar Events !</h1>
      <div className="flex justify-between items-start">
        <DateRangePicker onChange={handleDateRangeChange} />
        <Button className="rounded-lg p-0 px-0 py-0 overflow-hidden  aspect-square">
          {user?.data?.user?.image ? (
            <img src={user?.data?.user?.image || "/placeholder.svg"} alt="google logo" width={30} height={30} />
          ) : (
            <p>{user?.data?.user?.name?.charAt(0)}</p>
          )}
        </Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <EventTable events={events} page={currentPage} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => setCurrentPage(index)} isActive={currentPage === index}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext

                  onClick={(e) => {
                    if (!nextAvailable) return;

                    if (currentPage < totalPages - 1) {
                      setCurrentPage((prev) => prev + 1)
                    } else if (nextAvailable) {
                      fetchNextPage(e)
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  )
}


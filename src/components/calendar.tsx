"use client"

import { useState, useEffect, useCallback } from "react"
import { DateRangePicker } from "./date-range-picker"
import { EventTable } from "./event-table"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { startOfToday, format, addDays, startOfWeek, endOfWeek } from "date-fns"
import type { calendar_v3 } from "googleapis"
import { getCalendarEvents } from "@/actions/calender"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"
import { SignOutButton } from "./sign-out"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

export const MAX_PAGE_SIZE = 10

export function Calendar() {
  const user = useSession()
  const [events, setEvents] = useState<calendar_v3.Schema$Event[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(startOfToday()),
    end: endOfWeek(startOfToday()),
  })
  const [pageToken, setPageToken] = useState<string | null>()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nextAvailable, setNextAvailable] = useState<boolean>(false)

  async function fetchDataForDateRange() {
    setIsLoading(true)
    const params: any = {
      startDate: dateRange.start.toISOString(),
    }
    if (dateRange.end) {
      params.endDate = dateRange.end.toISOString()
    }

    try {
      const { events: newEvents, nextPageToken: newNextPageToken, hasNext } = await getCalendarEvents(params)
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

  async function fetchNextPage() {
    if (!pageToken) return
    setIsLoading(true)
    const params: any = {
      pageToken,
      startDate: dateRange.start.toISOString(),
    }
    if (dateRange.end) {
      params.endDate = dateRange.end.toISOString()
    }

    try {
      const { events: newEvents, nextPageToken: newNextPageToken, hasNext } = await getCalendarEvents(params)
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

  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setDateRange({ start, end })
  }, [])

  const navigateWeek = (direction: "prev" | "next") => {
    const newStart = direction === "prev" ? addDays(dateRange.start, -7) : addDays(dateRange.start, 7)
    const newEnd = addDays(newStart, 6)
    setDateRange({ start: newStart, end: newEnd })
  }

  useEffect(() => {
    fetchDataForDateRange()
  }, [dateRange])

  const totalPages = Math.ceil(events.length / MAX_PAGE_SIZE)

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Calendar Events</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" size={"icon"}>
                {user?.data?.user?.image ? (
                  <img
                    src={user.data.user.image || "/placeholder.svg"}
                    alt="User"
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="text-lg">{user?.data?.user?.name?.charAt(0)}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.data?.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.data?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center bg-muted px-3 py-1 rounded-md">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">
                  {format(dateRange.start, "MMM d")} - {dateRange.end && format(dateRange.end, "MMM d, yyyy")}
                </span>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <DateRangePicker onChange={handleDateRangeChange} />
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <EventTable events={events} page={currentPage} />
              <Pagination className="mt-4">
                <PaginationContent><PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <Button
                        variant={currentPage === index ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(index)}
                      >
                        {index + 1}
                      </Button>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (currentPage < totalPages - 1) {
                          setCurrentPage((prev) => prev + 1)
                        } else if (nextAvailable) {
                          fetchNextPage()
                        }
                      }}
                      disabled={!nextAvailable && currentPage === totalPages - 1}
                    >
                      Next
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


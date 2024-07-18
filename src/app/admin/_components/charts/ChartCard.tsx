'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CHART_RANGES } from "@/lib/chartRanges";
import { subDays } from "date-fns";
import { CalendarClock, CalendarDays } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, PropsWithChildren, useState } from "react";
import { DateRange } from "react-day-picker";

type ChartCardPros = {
  title: string
  selectedChartRangeQueryKey: string
  selectedChartRangeDropdownMenuItem: string
  selectedCustomChartRangeFromQueryKey: string
  selectedCustomChartRangeToQueryKey: string
} & PropsWithChildren & ComponentProps<typeof Card>

export default function ChartCard({title, children, selectedChartRangeQueryKey, selectedChartRangeDropdownMenuItem, selectedCustomChartRangeFromQueryKey, selectedCustomChartRangeToQueryKey, ...props}: ChartCardPros) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [customChartRange, setCustomChartRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date()
  })

  function selectChartRangeHandler(range: keyof typeof CHART_RANGES | DateRange){
    const chartRangeSearchParams = new URLSearchParams(searchParams)
    if (typeof range === "string") {
      chartRangeSearchParams.delete(selectedCustomChartRangeFromQueryKey)
      chartRangeSearchParams.delete(selectedCustomChartRangeToQueryKey)
      chartRangeSearchParams.set(selectedChartRangeQueryKey, range)
    } else {
      if (!range.from || !range.to) return
      chartRangeSearchParams.delete(selectedChartRangeQueryKey)
      chartRangeSearchParams.set(selectedCustomChartRangeFromQueryKey, range.from.toISOString())
      chartRangeSearchParams.set(selectedCustomChartRangeToQueryKey, range.to.toISOString())
    }

    router.push(`${pathname}?${chartRangeSearchParams.toString()}`, {
      scroll: false
    })
  }

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  {selectedChartRangeDropdownMenuItem}
                  <CalendarDays className="ms-2"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {
                  Object.entries(CHART_RANGES).map(([key, value]) => (
                    <DropdownMenuItem
                      key={key}
                      className="cursor-pointer"
                      onClick={() => selectChartRangeHandler(key as keyof typeof CHART_RANGES)}
                    >
                      {value.label}
                    </DropdownMenuItem>
                  ))
                }
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Custom</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <div className="55">
                      <Calendar 
                        mode="range" 
                        numberOfMonths={2} 
                        defaultMonth={customChartRange?.from} 
                        disabled={{after: new Date()}}
                        selected={customChartRange}
                        onSelect={setCustomChartRange}
                        />
                        <DropdownMenuItem>
                          <Button className="w-full" onClick={() => {
                            if (!customChartRange) return
                            selectChartRangeHandler(customChartRange)
                          }}>Select Range</Button>
                        </DropdownMenuItem>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
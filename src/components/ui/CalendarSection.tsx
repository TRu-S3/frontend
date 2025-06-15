"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export default function CalendarSection() {
  // 中央の月を管理
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2025, 6, 1)) // 7月スタート

  // 3ヶ月分のDateを生成
  const months = [
    addMonths(currentMonth, -1),
    currentMonth,
    addMonths(currentMonth, 1),
  ]

  // 各カレンダーの選択日を管理
  const [selected, setSelected] = React.useState<(Date | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ])

  return (
    <Card className="w-full bg-[#dddddd] p-8">
      <CardHeader>
        <div className="font-bold text-2xl mb-4">カレンダー</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-center items-center gap-4 overflow-x-auto">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            <ChevronLeft />
          </Button>
          <div className="flex flex-row gap-8">
            {months.map((date, i) => (
              <div key={i} className="flex flex-col items-center min-w-[320px] p-4">
                <Calendar
                  mode="single"
                  selected={selected[i]}
                  onSelect={dateSel => {
                    const next = [...selected]
                    next[i] = dateSel
                    setSelected(next)
                  }}
                  defaultMonth={date}
                  month={date}
                  className="rounded-md border shadow-sm bg-white p-4"
                  showOutsideDays={true}
                  classNames={{
                    nav: "hidden",
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
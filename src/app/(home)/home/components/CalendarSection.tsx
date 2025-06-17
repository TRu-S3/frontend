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
  const [calendarCount, setCalendarCount] = React.useState(3);

  React.useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 600) setCalendarCount(1);
      else if (window.innerWidth < 900) setCalendarCount(2);
      else setCalendarCount(3);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  // 中央のカレンダーがcurrentMonthになるようにmonths配列を生成
  const months = Array.from({ length: calendarCount }, (_, i) =>
    addMonths(currentMonth, i - Math.floor(calendarCount / 2))
  );

  // 各カレンダーの選択日を管理
  const [selected, setSelected] = React.useState<(Date | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ])

  return (
    <Card className="w-full bg-[#dddddd] p-4 md:p-6 lg:p-8">
      <CardHeader>
        <div className="font-bold text-2xl mb-4">カレンダー</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-center items-center gap-2 md:gap-4 lg:gap-6 overflow-x-auto">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            <ChevronLeft />
          </Button>
          <div className="flex flex-row gap-2 md:gap-4 lg:gap-6">
            {months.map((date, i) => (
              <div key={i} className="flex flex-col items-center min-w-[220px] md:min-w-[260px] lg:min-w-[300px] p-2 md:p-3 lg:p-4">
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
                  className="rounded-md border shadow-sm bg-white p-2 md:p-3 lg:p-4"
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
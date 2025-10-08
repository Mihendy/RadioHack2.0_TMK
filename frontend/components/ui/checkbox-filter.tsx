"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CheckboxFilterProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CheckboxFilter({ options, selected, onChange }: CheckboxFilterProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-2 pl-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={selected.includes(option)}
            onCheckedChange={() => handleToggle(option)}
            className="border-muted-foreground data-[state=checked]:bg-[#EE742D] data-[state=checked]:border-[#EE742D]"
          />
          <Label htmlFor={option} className="text-sm font-normal cursor-pointer hover:text-[#EE742D] transition-colors">
            {option}
          </Label>
        </div>
      ))}
    </div>
  )
}

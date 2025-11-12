"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface DebouncedInputProps extends React.ComponentProps<typeof Input> {
  value: string
  onValueChange?: (value: string) => void
  delay?: number
}

export default function DebouncedInput({ value, onValueChange, delay = 300, onChange, ...props }: DebouncedInputProps) {
  const [inner, setInner] = React.useState(value)

  React.useEffect(() => {
    setInner(value)
  }, [value])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inner !== value) {
        onValueChange?.(inner)
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [inner, delay, onValueChange, value])

  return (
    <Input
      {...props}
      value={inner}
      onChange={(event) => {
        setInner(event.target.value)
        onChange?.(event)
      }}
    />
  )
}

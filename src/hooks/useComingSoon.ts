import { useState } from 'react'

interface UseComingSoonReturn {
  isOpen: boolean
  featureName: string
  openComingSoon: (featureName: string) => void
  closeComingSoon: () => void
}

export function useComingSoon(): UseComingSoonReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [featureName, setFeatureName] = useState('')

  const openComingSoon = (name: string) => {
    setFeatureName(name)
    setIsOpen(true)
  }

  const closeComingSoon = () => {
    setIsOpen(false)
    setFeatureName('')
  }

  return {
    isOpen,
    featureName,
    openComingSoon,
    closeComingSoon,
  }
}

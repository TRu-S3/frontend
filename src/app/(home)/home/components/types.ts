export interface Hackathon {
  id: string
  title: string
  status: string
  desc: string
  deadline: string
  remainingDays: number
  currentMembers: number
  maxMembers: number
  avatar: string
  avatarFallback: string
}

export interface User {
  id: string
  name: string
  skills: string[]
  intro: string
  projects: { label: string; url: string }[]
  hackathons: Hackathon[]
}

export interface HackathonCache {
  [userId: string]: {
    data: Hackathon[]
    timestamp: number
  }
}

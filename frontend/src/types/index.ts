export type Page = 'home' | 'matches' | 'map' | 'players' | 'profile'

export type Sport = {
  id: string
  name: string
  icon: string
}

export type Player = {
  id: number
  name: string
  initials: string
  sport: string
  level: string
  distance: string
  reputation: number
  matches: number
  reviews: number
}

export type Match = {
  id: number
  title: string
  sport: string
  icon: string
  location: string
  distance: number
  date: string
  time: string
  players: number
  maxPlayers: number
  level: string
  price: string
  hostId: number
  lat: number
  lng: number
}

export type Message = {
  id: number
  sender: string
  initials: string
  text: string
  time: string
  mine?: boolean
}

export type Notification = {
  id: number
  title: string
  text: string
  time: string
  unread: boolean
}

export type NewMatchDraft = {
  title: string
  sport: string
  location: string
  date: string
  time: string
  players: number
  level: string
  price: string
}

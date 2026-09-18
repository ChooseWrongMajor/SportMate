import { useEffect, useMemo, useState } from 'react'

import {
  currentUser,
  defaultMatches,
  defaultMessages,
  defaultNotifications,
  players,
  sports,
} from '../data/mockData'
import type { Match, Message, Notification, Page, Player } from '../types'

export function useSportMateApp() {
  const [page, setPage] = useState<Page>('home')

  const [selectedSport, setSelectedSport] = useState('all')
  const [search, setSearch] = useState('')
  const [distanceFilter, setDistanceFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('sportmate_matches')
    return saved ? JSON.parse(saved) : defaultMatches
  })

  const [joinedMatches, setJoinedMatches] = useState<number[]>(() => {
    const saved = localStorage.getItem('sportmate_joined')
    return saved ? JSON.parse(saved) : []
  })

  const [messages, setMessages] = useState<Record<number, Message[]>>(() => {
    const saved = localStorage.getItem('sportmate_messages')
    return saved ? JSON.parse(saved) : defaultMessages
  })

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('sportmate_notifications')
    return saved ? JSON.parse(saved) : defaultNotifications
  })

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [chatMatch, setChatMatch] = useState<Match | null>(null)
  const [message, setMessage] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [authUser, setAuthUser] = useState<{ id: number; name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('sportmate_auth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('sportmate_token'))
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  const [newMatch, setNewMatch] = useState({
    title: '',
    sport: 'football',
    location: '',
    date: '',
    time: '',
    players: 10,
    level: 'Mọi trình độ',
    price: 'Miễn phí',
  })

  useEffect(() => {
    localStorage.setItem('sportmate_matches', JSON.stringify(matches))
  }, [matches])

  useEffect(() => {
    localStorage.setItem('sportmate_joined', JSON.stringify(joinedMatches))
  }, [joinedMatches])

  useEffect(() => {
    localStorage.setItem('sportmate_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem('sportmate_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('sportmate_token', authToken)
    } else {
      localStorage.removeItem('sportmate_token')
    }
  }, [authToken])

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('sportmate_auth_user', JSON.stringify(authUser))
    } else {
      localStorage.removeItem('sportmate_auth_user')
    }
  }, [authUser])

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const sportOK = selectedSport === 'all' || match.sport === selectedSport
      const searchOK = `${match.title} ${match.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
      const distanceOK = distanceFilter === 'all' || match.distance <= Number(distanceFilter)
      const levelOK = levelFilter === 'all' || match.level === levelFilter

      return sportOK && searchOK && distanceOK && levelOK
    })
  }, [matches, selectedSport, search, distanceFilter, levelFilter])

  const unreadNotifications = notifications.filter((item) => item.unread).length

  function navigate(nextPage: Page) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function joinMatch(match: Match) {
    const alreadyJoined = joinedMatches.includes(match.id)

    if (alreadyJoined) {
      setJoinedMatches((current) => current.filter((id) => id !== match.id))
      setMatches((current) =>
        current.map((item) =>
          item.id === match.id
            ? { ...item, players: Math.max(1, item.players - 1) }
            : item,
        ),
      )
      return
    }

    if (match.players >= match.maxPlayers) {
      alert('Kèo đã đủ người.')
      return
    }

    setJoinedMatches((current) => [...current, match.id])
    setMatches((current) =>
      current.map((item) =>
        item.id === match.id ? { ...item, players: item.players + 1 } : item,
      ),
    )

    const notification: Notification = {
      id: Date.now(),
      title: 'Tham gia kèo thành công',
      text: match.title,
      time: 'Vừa xong',
      unread: true,
    }

    setNotifications((current) => [notification, ...current])
  }

  function createMatch() {
    if (!newMatch.title.trim()) {
      alert('Vui lòng nhập tên kèo.')
      return
    }

    if (!newMatch.location.trim()) {
      alert('Vui lòng nhập địa điểm.')
      return
    }

    const selected = sports.find((sport) => sport.id === newMatch.sport) ?? sports[1]

    const created: Match = {
      id: Date.now(),
      title: newMatch.title,
      sport: newMatch.sport,
      icon: selected.icon,
      location: newMatch.location,
      distance: 0.5,
      date: newMatch.date || 'Sắp tới',
      time: newMatch.time || 'Chưa xác định',
      players: 1,
      maxPlayers: newMatch.players,
      level: newMatch.level,
      price: newMatch.price,
      hostId: currentUser.id,
      lat: 10.85,
      lng: 106.76,
    }

    setMatches((current) => [created, ...current])
    setJoinedMatches((current) => [...current, created.id])
    setShowCreate(false)
    setNewMatch({
      title: '',
      sport: 'football',
      location: '',
      date: '',
      time: '',
      players: 10,
      level: 'Mọi trình độ',
      price: 'Miễn phí',
    })

    setNotifications((current) => [
      {
        id: Date.now(),
        title: 'Kèo đã được tạo',
        text: created.title,
        time: 'Vừa xong',
        unread: true,
      },
      ...current,
    ])
  }

  function sendMessage() {
    if (!chatMatch || !message.trim()) {
      return
    }

    const newMessage: Message = {
      id: Date.now(),
      sender: currentUser.name,
      initials: currentUser.initials,
      text: message.trim(),
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      mine: true,
    }

    setMessages((current) => ({
      ...current,
      [chatMatch.id]: [...(current[chatMatch.id] ?? []), newMessage],
    }))

    setMessage('')
  }

  function enableLocation() {
    if (!navigator.geolocation) {
      setLocationEnabled(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => setLocationEnabled(true),
      () => setLocationEnabled(true),
    )
  }

  function markNotificationsRead() {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      })),
    )
  }

  async function handleAuthSubmit(
    payload: { name?: string; email: string; password: string },
    mode: 'login' | 'register',
  ) {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register'
      const response = await fetch(`http://54.255.188.96:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.')
      }

      setAuthToken(data.token)
      setAuthUser(data.user)
      setShowLogin(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra.'
      setAuthError(message)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  function getHost(match: Match) {
    if (match.hostId === currentUser.id) {
      return currentUser
    }

    return players.find((player) => player.id === match.hostId) ?? players[0]
  }

  return {
    page,
    navigate,
    search,
    setSearch,
    selectedSport,
    setSelectedSport,
    distanceFilter,
    setDistanceFilter,
    levelFilter,
    setLevelFilter,
    filteredMatches,
    matches,
    players,
    currentUser,
    joinedMatches,
    notifications,
    unreadNotifications,
    selectedMatch,
    setSelectedMatch,
    selectedPlayer,
    setSelectedPlayer,
    chatMatch,
    setChatMatch,
    message,
    setMessage,
    showCreate,
    setShowCreate,
    showLogin,
    setShowLogin,
    showNotifications,
    setShowNotifications,
    locationEnabled,
    enableLocation,
    newMatch,
    setNewMatch,
    joinMatch,
    createMatch,
    sendMessage,
    markNotificationsRead,
    handleAuthSubmit,
    authUser,
    authError,
    authLoading,
    getHost,
    messages,
  }
}

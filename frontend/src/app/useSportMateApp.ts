import { useEffect, useMemo, useState } from 'react'

import {
  currentUser,
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

  // Danh sách kèo được tải từ backend PostgreSQL.
  const [matches, setMatches] = useState<Match[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)
  const [matchesError, setMatchesError] = useState<string | null>(null)

  // Hồ sơ và danh sách người chơi được lấy từ backend.
  const [apiPlayers, setApiPlayers] = useState<Player[]>([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [authProfile, setAuthProfile] = useState<Player | null>(null)

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

  const [authUser, setAuthUser] = useState<{
    id: number
    name: string
    email: string
  } | null>(() => {
    const saved = localStorage.getItem('sportmate_auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const [authToken, setAuthToken] = useState<string | null>(
    () => localStorage.getItem('sportmate_token'),
  )

  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [createMatchLoading, setCreateMatchLoading] = useState(false)

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

  // Tải danh sách kèo từ backend.
  useEffect(() => {
    const controller = new AbortController()

    async function loadMatches() {
      try {
        setMatchesLoading(true)
        setMatchesError(null)

        const apiUrl = import.meta.env.VITE_API_URL

        if (!apiUrl) {
          throw new Error(
            'Chưa cấu hình VITE_API_URL trong frontend/.env.local.',
          )
        }

        const response = await fetch(`${apiUrl}/matches`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Không thể tải danh sách kèo. HTTP ${response.status}`,
          )
        }

        const data: { matches?: Match[] } = await response.json()

        if (!Array.isArray(data.matches)) {
          throw new Error('Dữ liệu danh sách kèo từ backend không hợp lệ.')
        }

        setMatches(data.matches)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setMatchesError(
          error instanceof Error
            ? error.message
            : 'Có lỗi khi tải danh sách kèo.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setMatchesLoading(false)
        }
      }
    }

    void loadMatches()

    return () => controller.abort()
  }, [])

  // Tải danh sách người chơi thật từ backend.
  useEffect(() => {
    const controller = new AbortController()

    async function loadPlayers() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) return

        const response = await fetch(`${apiUrl}/players`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Không thể tải danh sách người chơi. HTTP ${response.status}`)
        }

        const data: { players?: Player[] } = await response.json()
        if (Array.isArray(data.players)) setApiPlayers(data.players)
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setProfileError(error.message)
          console.error('Không thể tải danh sách người chơi:', error)
        }
      }
    }

    void loadPlayers()
    return () => controller.abort()
  }, [])

  // Tải hồ sơ tài khoản đang đăng nhập từ API /me.
  useEffect(() => {
    if (!authToken) {
      setAuthProfile(null)
      setProfileLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadMyProfile() {
      try {
        setProfileLoading(true)
        setProfileError(null)

        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) {
          throw new Error('Chưa cấu hình VITE_API_URL trong frontend/.env.local.')
        }

        const response = await fetch(`${apiUrl}/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
          signal: controller.signal,
        })
        const data: { user?: Record<string, unknown>; message?: string } =
          await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Không thể tải hồ sơ người dùng.')
        }

        if (data.user) {
          setAuthProfile({
            ...currentUser,
            ...data.user,
            id: Number(data.user.id),
            name: String(data.user.name ?? ''),
            email: String(data.user.email ?? ''),
          } as Player)
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setProfileError(error.message)
          console.error('Không thể tải hồ sơ người dùng:', error)
        }
      } finally {
        if (!controller.signal.aborted) setProfileLoading(false)
      }
    }

    void loadMyProfile()
    return () => controller.abort()
  }, [authToken])

  // Đồng bộ các kèo người dùng đã tham gia từ backend khi đăng nhập.
  useEffect(() => {
    if (!authToken) {
      setJoinedMatches([])
      return
    }

    const controller = new AbortController()

    async function loadJoinedMatches() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) return

        const response = await fetch(`${apiUrl}/me/matches`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        })

        if (!response.ok) return

        const data: { matches?: Match[] } = await response.json()
        if (Array.isArray(data.matches)) {
          setJoinedMatches(data.matches.map((match) => match.id))
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Không thể tải các kèo đã tham gia:', error)
        }
      }
    }

    void loadJoinedMatches()
    return () => controller.abort()
  }, [authToken])

  // Lưu các dữ liệu cục bộ chưa chuyển sang backend.
  useEffect(() => {
    localStorage.setItem('sportmate_joined', JSON.stringify(joinedMatches))
  }, [joinedMatches])

  useEffect(() => {
    localStorage.setItem('sportmate_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem(
      'sportmate_notifications',
      JSON.stringify(notifications),
    )
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
      const sportOK =
        selectedSport === 'all' || match.sport === selectedSport

      const searchOK = `${match.title} ${match.location}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const distanceOK =
        distanceFilter === 'all' ||
        match.distance <= Number(distanceFilter)

      const levelOK =
        levelFilter === 'all' || match.level === levelFilter

      return sportOK && searchOK && distanceOK && levelOK
    })
  }, [matches, selectedSport, search, distanceFilter, levelFilter])

  const unreadNotifications = notifications.filter(
    (item) => item.unread,
  ).length

  function navigate(nextPage: Page) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Tham gia/rời kèo qua backend PostgreSQL.
  async function joinMatch(match: Match) {
    if (!authToken) {
      alert('Vui lòng đăng nhập để tham gia hoặc rời kèo.')
      setShowLogin(true)
      return
    }

    const alreadyJoined = joinedMatches.includes(match.id)

    if (!alreadyJoined && match.players >= match.maxPlayers) {
      alert('Kèo đã đủ người.')
      return
    }

    const apiUrl = import.meta.env.VITE_API_URL

    if (!apiUrl) {
      alert('Chưa cấu hình VITE_API_URL trong frontend/.env.local.')
      return
    }

    try {
      const response = await fetch(
        `${apiUrl}/matches/${match.id}/join`,
        {
          method: alreadyJoined ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      const data: { message?: string; joined?: boolean; matchId?: number } =
        await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật trạng thái tham gia kèo.')
      }

      // Tải lại danh sách từ backend để số người tham gia luôn chính xác.
      const matchesResponse = await fetch(`${apiUrl}/matches`)
      const matchesData: { matches?: Match[] } = await matchesResponse.json()

      if (!matchesResponse.ok || !Array.isArray(matchesData.matches)) {
        throw new Error('Đã cập nhật tham gia nhưng không tải lại được danh sách kèo.')
      }

      setMatches(matchesData.matches)

      if (alreadyJoined) {
        setJoinedMatches((current) =>
          current.filter((id) => id !== match.id),
        )
      } else {
        setJoinedMatches((current) =>
          current.includes(match.id) ? current : [...current, match.id],
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
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi cập nhật trạng thái tham gia kèo.',
      )
    }
  }

  // Tạo kèo qua API backend và lưu dữ liệu vào PostgreSQL.
  async function createMatch() {
    if (!newMatch.title.trim()) {
      alert('Vui lòng nhập tên kèo.')
      return
    }

    if (!newMatch.location.trim()) {
      alert('Vui lòng nhập địa điểm.')
      return
    }

    if (!authToken) {
      alert('Vui lòng đăng nhập trước khi tạo kèo.')
      setShowLogin(true)
      return
    }

    const selected =
      sports.find((sport) => sport.id === newMatch.sport) ?? sports[1]

    try {
      setCreateMatchLoading(true)

      const apiUrl = import.meta.env.VITE_API_URL

      if (!apiUrl) {
        throw new Error(
          'Chưa cấu hình VITE_API_URL trong frontend/.env.local.',
        )
      }

      const response = await fetch(`${apiUrl}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: newMatch.title.trim(),
          sport: newMatch.sport,
          icon: selected.icon,
          location: newMatch.location.trim(),
          date: newMatch.date || 'Sắp tới',
          time: newMatch.time || 'Chưa xác định',
          maxPlayers: newMatch.players,
          level: newMatch.level,
          price: newMatch.price,
          distance: 0.5,
          lat: 10.85,
          lng: 106.76,
        }),
      })

      const data: { match?: Match; message?: string } = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo kèo.')
      }

      if (!data.match) {
        throw new Error('Backend không trả về dữ liệu kèo vừa tạo.')
      }

      const created = data.match

      setMatches((current) => [
        created,
        ...current.filter((item) => item.id !== created.id),
      ])

      setJoinedMatches((current) =>
        current.includes(created.id)
          ? current
          : [...current, created.id],
      )

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

      alert('Tạo kèo thành công!')
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi tạo kèo.',
      )
    } finally {
      setCreateMatchLoading(false)
    }
  }

  // Tải lịch sử tin nhắn của một kèo từ backend.
  async function loadMessages(matchId: number) {
    if (!authToken) {
      setShowLogin(true)
      alert('Vui lòng đăng nhập để xem tin nhắn.')
      return
    }

    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) {
      alert('Chưa cấu hình VITE_API_URL trong frontend/.env.local.')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/matches/${matchId}/messages`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data: { messages?: Message[]; message?: string } =
        await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải tin nhắn.')
      }

      if (!Array.isArray(data.messages)) {
        throw new Error('Dữ liệu tin nhắn từ backend không hợp lệ.')
      }

      setMessages((current) => ({
        ...current,
        [matchId]: data.messages!,
      }))
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Có lỗi khi tải tin nhắn.',
      )
    }
  }

  // Tự động tải lịch sử khi người dùng mở một cuộc trò chuyện.
  useEffect(() => {
    if (!chatMatch || !authToken) return

    const controller = new AbortController()

    async function loadChatHistory() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) return

        const response = await fetch(
          `${apiUrl}/matches/${chatMatch!.id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            signal: controller.signal,
          },
        )

        const data: { messages?: Message[]; message?: string } =
          await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Không thể tải tin nhắn.')
        }

        if (Array.isArray(data.messages)) {
          setMessages((current) => ({
            ...current,
            [chatMatch!.id]: data.messages!,
          }))
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Không thể tải lịch sử tin nhắn:', error)
        }
      }
    }

    void loadChatHistory()
    return () => controller.abort()
  }, [chatMatch, authToken])

  // Gửi tin nhắn đến backend và lưu trong PostgreSQL.
  async function sendMessage() {
    if (!chatMatch || !message.trim()) {
      return
    }

    if (!authToken) {
      alert('Vui lòng đăng nhập để gửi tin nhắn.')
      setShowLogin(true)
      return
    }

    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) {
      alert('Chưa cấu hình VITE_API_URL trong frontend/.env.local.')
      return
    }

    try {
      const response = await fetch(
        `${apiUrl}/matches/${chatMatch.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ text: message.trim() }),
        },
      )

      const data: { message?: Message; messageText?: string } =
        await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.message === 'string'
            ? data.message
            : 'Không thể gửi tin nhắn.',
        )
      }

      // Backend trả về object { message: {...} }; TypeScript cần kiểm tra dữ liệu.
      const sentMessage = data.message as unknown as Message | undefined

      if (!sentMessage || typeof sentMessage !== 'object') {
        throw new Error('Backend không trả về tin nhắn hợp lệ.')
      }

      setMessages((current) => ({
        ...current,
        [chatMatch.id]: [
          ...(current[chatMatch.id] ?? []),
          sentMessage,
        ],
      }))

      setMessage('')
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Có lỗi khi gửi tin nhắn.',
      )
    }
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

  // Đánh dấu thông báo đã đọc trong PostgreSQL.
  async function markNotificationsRead() {
    if (!authToken) {
      setNotifications((current) =>
        current.map((item) => ({ ...item, unread: false })),
      )
      return
    }

    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) {
      alert('Chưa cấu hình VITE_API_URL trong frontend/.env.local.')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/notifications/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data: { updated?: boolean; message?: string } =
        await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật thông báo.')
      }

      setNotifications((current) =>
        current.map((item) => ({ ...item, unread: false })),
      )
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Có lỗi khi đánh dấu thông báo đã đọc.',
      )
    }
  }

  // Tải thông báo từ PostgreSQL khi token thay đổi/đăng nhập.
  useEffect(() => {
    if (!authToken) return

    const controller = new AbortController()

    async function loadNotifications() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) return

        const response = await fetch(`${apiUrl}/notifications`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        })

        if (!response.ok) return

        const data: { notifications?: Notification[] } =
          await response.json()

        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications)
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Không thể tải thông báo:', error)
        }
      }
    }

    void loadNotifications()
    return () => controller.abort()
  }, [authToken])

  async function handleAuthSubmit(
    payload: { name?: string; email: string; password: string },
    mode: 'login' | 'register',
  ) {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL

      if (!apiUrl) {
        throw new Error(
          'Chưa cấu hình VITE_API_URL trong frontend/.env.local.',
        )
      }

      const endpoint = mode === 'login' ? '/login' : '/register'

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data: {
        token?: string
        user?: { id: number; name: string; email: string }
        message?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.')
      }

      if (!data.token || !data.user) {
        throw new Error('Backend không trả về thông tin đăng nhập hợp lệ.')
      }

      setAuthToken(data.token)
      setAuthUser(data.user)
      setShowLogin(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Có lỗi xảy ra.'

      setAuthError(errorMessage)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const activeUser = authProfile
    ?? (authUser
      ? ({
          ...currentUser,
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
        } as Player)
      : currentUser)

  function getHost(match: Match) {
    if (activeUser && match.hostId === activeUser.id) {
      return activeUser
    }

    return apiPlayers.find((player) => player.id === match.hostId)
      ?? players.find((player) => player.id === match.hostId)
      ?? apiPlayers[0]
      ?? players[0]
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
    matchesLoading,
    matchesError,
    players: apiPlayers,
    currentUser: activeUser,
    profileLoading,
    profileError,
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
    createMatchLoading,
    sendMessage,
    loadMessages,
    markNotificationsRead,
    handleAuthSubmit,
    authUser,
    authToken,
    authError,
    authLoading,
    getHost,
    messages,
  }
}

import '@fontsource/lexend/400.css'
import '@fontsource/lexend/500.css'
import '@fontsource/lexend/600.css'
import '@fontsource/lexend/700.css'
import '../styles/base.css'
import '../styles/navigation.css'
import '../styles/cards.css'
import '../styles/pages.css'
import '../styles/modals.css'
import '../styles/responsive.css'

import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { ChatModal } from '../components/modals/ChatModal'
import { CreateMatchModal } from '../components/modals/CreateMatchModal'
import { LoginModal } from '../components/modals/LoginModal'
import { MatchModal } from '../components/modals/MatchModal'
import { PlayerModal } from '../components/modals/PlayerModal'
import { NotificationPanel } from '../components/NotificationPanel'
import { HomePage } from '../pages/Home'
import { MapPage } from '../pages/Map'
import { MatchesPage } from '../pages/Matches'
import { PlayersPage } from '../pages/Players'
import { ProfilePage } from '../pages/Profile'
import { useSportMateApp } from './useSportMateApp'

export default function App() {
  const {
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
  } = useSportMateApp()

  return (
    <div className="app">
      <Header
        page={page}
        navigate={navigate}
        onCreate={() => setShowCreate(true)}
        onLogin={() => setShowLogin(true)}
        unread={unreadNotifications}
        onNotification={() => setShowNotifications((value) => !value)}
        userName={authUser?.name}
      />

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onRead={markNotificationsRead}
        />
      )}

      {page === 'home' && (
        <HomePage
          search={search}
          setSearch={setSearch}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          matches={filteredMatches}
          joinedMatches={joinedMatches}
          players={players}
          locationEnabled={locationEnabled}
          enableLocation={enableLocation}
          navigate={navigate}
          joinMatch={joinMatch}
          setSelectedMatch={setSelectedMatch}
          setChatMatch={setChatMatch}
          setSelectedPlayer={setSelectedPlayer}
          onCreate={() => setShowCreate(true)}
        />
      )}

      {page === 'matches' && (
        <MatchesPage
          search={search}
          setSearch={setSearch}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          distanceFilter={distanceFilter}
          setDistanceFilter={setDistanceFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          matches={filteredMatches}
          joinedMatches={joinedMatches}
          joinMatch={joinMatch}
          setSelectedMatch={setSelectedMatch}
          setChatMatch={setChatMatch}
          enableLocation={enableLocation}
          locationEnabled={locationEnabled}
          onCreate={() => setShowCreate(true)}
          players={players}
          currentUser={currentUser}
        />
      )}

      {page === 'map' && (
        <MapPage
          matches={filteredMatches}
          locationEnabled={locationEnabled}
          enableLocation={enableLocation}
          setSelectedMatch={setSelectedMatch}
        />
      )}

      {page === 'players' && (
        <PlayersPage
          players={players}
          setSelectedPlayer={setSelectedPlayer}
        />
      )}

      {page === 'profile' && (
        <ProfilePage
          user={currentUser}
          joinedMatches={matches.filter((match) =>
            joinedMatches.includes(match.id),
          )}
          setSelectedMatch={setSelectedMatch}
        />
      )}

      <Footer />

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          host={getHost(selectedMatch)}
          joined={joinedMatches.includes(selectedMatch.id)}
          onClose={() => setSelectedMatch(null)}
          onJoin={() => {
            joinMatch(selectedMatch)
          }}
          onChat={() => {
            setChatMatch(selectedMatch)
            setSelectedMatch(null)
          }}
        />
      )}

      {chatMatch && (
        <ChatModal
          match={chatMatch}
          messages={messages[chatMatch.id] ?? []}
          message={message}
          setMessage={setMessage}
          onSend={sendMessage}
          onClose={() => setChatMatch(null)}
        />
      )}

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {showCreate && (
        <CreateMatchModal
          value={newMatch}
          setValue={setNewMatch}
          onClose={() => setShowCreate(false)}
          onCreate={createMatch}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSubmit={handleAuthSubmit}
          loading={authLoading}
          error={authError}
        />
      )}
    </div>
  )
}

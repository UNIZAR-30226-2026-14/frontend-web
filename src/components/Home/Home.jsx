import { useState, useEffect } from "react";
import { sileo } from "sileo";
import "./Home.css";
import FriendsList from "../TopMenu/FriendsList/FriendsList.jsx";
import Shop from "../TopMenu/Shop/Shop.jsx";
import Profile from "../TopMenu/Profile/Profile.jsx";
import TopMenu from "../TopMenu/TopMenu.jsx";
import PendingGames from "../UI/PendingGames/PendingGames.jsx";
import { gameService, friendService } from "../../services/gameService.js";

import {
  AVATAR_LIST,
  PENDING_GAMES,
  getAvatarDisplay,
  getProfileImageRaw,
} from "../../data/itemData.jsx";

function Home({
  onStart,
  user,
  onLogout,
  coins,
  setCoins,
  userAvatar,
  setUserAvatar,
  currentBackground,
  setCurrentBackground,
  ownedBgs,
  setOwnedBgs,
  currentSkin,
  setCurrentSkin,
  ownedSkins,
  setOwnedSkins,
  modeChosen,
  setModeChosen,
  isHost,
  setIsHost,
}) {
  const [activePopup, setActivePopup] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);

  const [matchStats] = useState(() => {
    const wins = user.partidasGanadas;
    const losses = user.partidasPerdidas;
    const draws = user.partidasEmpatadas;

    return { wins, losses, draws };
  });

  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isWaitingForStart, setIsWaitingForStart] = useState(false);

  const [showPlayOptions, setShowPlayOptions] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const [userName, setUserName] = useState(user?.nombre || "Invitado");

  const [showResumeModal, setShowResumeModal] = useState(false);

  const [friends, setFriends] = useState([]);

  const [opponents, setOpponents] = useState([]);

  const refreshLobbyParticipants = async () => {
    if (!roomCode) return;
    const idPartida = roomCode.replace("RUM-", "");
    try {
      const lista = await gameService.getParticipationByGame(idPartida);
      const otros = lista.filter((p) => p.idJugador !== user.id);
      setOpponents(otros);
    } catch (error) {
      console.error("Error al actualizar participantes:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (showCodeModal && roomCode) {
      refreshLobbyParticipants();
      interval = setInterval(refreshLobbyParticipants, 3000);
    }
    return () => clearInterval(interval);
  }, [showCodeModal, roomCode]);

  const handleNameChange = (newName) => {
    setUserName(newName);
  };

  const [challengeId, setChallengeId] = useState(null);

  const handleChallenge = async (opponentId) => {
    try {
      const idPartida = roomCode.replace("RUM-", "");
      const invitation = await gameService.createInvitation(
        opponentId,
        idPartida,
      );

      if (invitation) {
        sileo.success({
          title: "Invitación enviada",
          description: "Esperando respuesta del oponente...",
        });
      }
    } catch (error) {
      sileo.error({
        title: "Error",
        description: "No se pudo completar el desafío.",
      });
    }
  };

  const handleAnswerChallenge = async (friendId, gameId, accept) => {
    try {
      console.log("Datos enviados:", {
        myId: user?.id,
        friendId,
        gameId,
        accept,
      });

      if (!user?.id) throw new Error("El ID de usuario no existe");

      const ok = await gameService.answerChallenge(
        friendId,
        user.id,
        gameId,
        accept,
      );

      if (ok) {
        if (accept) {
          sileo.success({
            title: "¡Reto aceptado!",
            description: "Entrando...",
          });
          setRoomCode(`RUM-${gameId}`);
          setIsHost(false);
          setIsWaitingForStart(true);
          onStart(gameId);
        } else {
          sileo.info({
            title: "Reto rechazado",
            description: "La invitación ha sido eliminada.",
          });
          loadFriendList();
        }
      }
    } catch (error) {
      console.error("Error capturado en handleAnswerChallenge:", error);

      sileo.error({
        title: "Error de ejecución",
        description: error.message || "No se pudo procesar la respuesta.",
      });
      console.log(error.message);
    }
  };

  /**
   * Alterna la visibilidad de los popups. Si el popup ya está abierto,
   * lo cierra.
   * @param {string} popupName - Nombre del popup a mostrar ("profile", "friends", "shop").
   */
  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const openOwnProfile = () => {
    setSelectedFriendProfile(null);
    setActivePopup("profile");
  };

  const openFriendProfile = async (friendId) => {
    const profile = await friendService.getFriendsProfile(user.id, friendId);
    if (!profile) {
      alert("No se pudo cargar el perfil del amigo");
      return;
    }

    setSelectedFriendProfile({
      userId: profile.id,
      user: profile,
      avatar: getAvatarDisplay(profile.urlImgPerfil),
      coins: profile.monedas || 0,
      stats: {
        wins: profile.partidasGanadas || 0,
        losses: profile.partidasPerdidas || 0,
        draws: profile.partidasEmpatadas || 0,
        pending: profile.partidasPendientes || 0,
        finished: profile.partidasFinalizadas || 0,
      },
    });
    setActivePopup("profile");
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const success = await friendService.removeFriendship(user.id, friendId);

      if (success) {
        setSelectedFriendProfile(null);
        setActivePopup("friends");
        //sileo.success({ title: "Amigo eliminado" });
      } else {
        alert("No se pudo eliminar al amigo del servidor.");
      }
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
      alert("Error de conexión al intentar eliminar al amigo.");
    }
  };

  const handleCreatePrivateGame = async (mode) => {
    try {
      const nuevaPartida = await gameService.createGame(
        mode === "arcade",
        true,
      );
      const idNuevaPartida = nuevaPartida.idPartida;
      const unido = await gameService.joinGame(user.id, idNuevaPartida);
      setShowPlayOptions(false);

      if (unido) {
        setRoomCode(`RUM-${idNuevaPartida}`);
        setIsHost(true);
        setShowCodeModal(true);
      }
    } catch (error) {
      console.error(error.message);
      alert("Error al crear partida privada. Inténtalo de nuevo.");
    }
  };

  const handleQuickMatch = async (mode) => {
    try {
      const partidas = await gameService.getAllGames(mode === "arcade");
      setRoomCode(`RUM-${partidas.idPartida}`);
      setIsHost(partidas.creadaNuevaPartida);
      setIsWaitingForStart(!partidas.creadaNuevaPartida);
      onStart(partidas.idPartida);
    } catch (error) {
      console.error("Error en matchmaking:", error);
      alert("No se pudo encontrar partida.");
      setActivePopup(null);
    }
  };

  const handleStartLobbyGame = async () => {
    const idPartida = roomCode.replace("RUM-", "");
    try {
      const iniciada = await gameService.startGame(idPartida);

      if (iniciada) {
        onStart(idPartida);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        console.warn("La partida ya está en curso, intentando entrar...");
        onStart(idPartida);
      } else {
        sileo.error({
          title: "Error al iniciar",
          description: "Asegúrate de que haya suficientes jugadores.",
        });
      }
    }
  };

  const handleJoinByCode = async () => {
    try {
      const idLimpio = joinCode.replace("RUM-", "").trim();
      const idPartidaNumerico = parseInt(idLimpio);

      if (isNaN(idPartidaNumerico)) {
        alert("Formato de código inválido. Debe ser RUM-número");
        return;
      }

      const unido = await gameService.joinGame(user.id, idPartidaNumerico);

      if (unido) {
        setRoomCode(`RUM-${idPartidaNumerico}`);
        setIsHost(false);
        setIsWaitingForStart(true);
        onStart(idPartidaNumerico);
      } else {
        alert("La sala no existe o está llena.");
      }
    } catch (error) {
      alert("Error de conexión al intentar unirse.");
    }
  };

  useEffect(() => {
    let interval;

    if (isWaitingForStart) {
      interval = setInterval(async () => {
        const id = roomCode.replace("RUM-", "");
        try {
          const partida = await gameService.getGameStatus(id);

          if (partida.estado === "RUNNING") {
            clearInterval(interval);
            setIsWaitingForStart(false);
            onStart(id);
          }
        } catch (e) {
          console.error("Error comprobando estado:", e);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isWaitingForStart, roomCode, onStart]);

  useEffect(() => {
    let interval;
    if (isWaitingForStart && !isHost) {
      interval = setInterval(async () => {
        const id = roomCode.replace("RUM-", "");
        const partida = await gameService.getGameStatus(id);
        if (partida.estado === "RUNNING") {
          clearInterval(interval);
          onStart(id);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isWaitingForStart, isHost, roomCode]);

  const loadFriendList = async () => {
    try {
      const listaAmigos = await friendService.getFriends(user.id);
      setFriends(listaAmigos);
    } catch (err) {
      sileo.error({
        title: "Error de conexión.",
        description: "No se pudieron sincronizar tus amigos.",
      });
    }
  };

  useEffect(() => {
    if (user.id) loadFriendList();
  }, [user.id]);

  return (
    <div className="home-screen">
      {/* Barra superior */}
      <TopMenu
        userAvatar={userAvatar}
        user={{ ...user, nombre: userName }}
        togglePopup={togglePopup}
        openOwnProfile={openOwnProfile}
        setActivePopup={setActivePopup}
      />

      {/* Pop-up del perfil */}
      {activePopup === "profile" && (
        <Profile
          onClose={() => {
            setSelectedFriendProfile(null);
            setActivePopup(null);
          }}
          onLogout={onLogout}
          currentAvatar={selectedFriendProfile?.avatar || userAvatar}
          setUserAvatar={selectedFriendProfile ? null : setUserAvatar}
          avatarList={selectedFriendProfile ? [] : AVATAR_LIST}
          myId={user.id}
          userId={selectedFriendProfile?.userId || user.id}
          user={
            selectedFriendProfile
              ? selectedFriendProfile.user
              : { ...user, nombre: userName }
          }
          onNameChange={handleNameChange}
          coins={selectedFriendProfile?.coins ?? coins}
          stats={
            selectedFriendProfile?.stats || {
              wins: matchStats.wins,
              losses: matchStats.losses,
              draws: matchStats.draws,
              pending: user.partidasPendientes,
              finished: user.partidasFinalizadas,
            }
          }
          onRemoveFriend={selectedFriendProfile ? handleRemoveFriend : null}
        />
      )}

      {/* Pop-up de los amigos */}
      {activePopup === "friends" && (
        <FriendsList
          onClose={() => togglePopup("friends")}
          onOpenProfile={openFriendProfile}
          userId={user.id}
          onAnswerChallenge={handleAnswerChallenge}
        />
      )}

      {/* Pop-up de la tienda */}
      {activePopup === "shop" && (
        <Shop
          userId={user.id}
          onClose={() => togglePopup("shop")}
          coins={coins}
          setCoins={setCoins}
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          ownedBgs={ownedBgs}
          setOwnedBgs={setOwnedBgs}
          currentSkin={currentSkin}
          setCurrentSkin={setCurrentSkin}
          ownedSkins={ownedSkins}
          setOwnedSkins={setOwnedSkins}
        />
      )}

      {showCodeModal && (
        <div className="lobby-overlay">
          <div className="lobby-modal custom-lobby">
            <button
              className="close-button"
              onClick={() => setShowCodeModal(false)}
            >
              ✕
            </button>

            <div className="lobby-slots-container">
              {[0, 1, 2, 3].map((index) => {
                if (index === 0) {
                  return (
                    <div key="slot-me" className="player-slot">
                      <div className="slot-avatar">
                        <img
                          src={getAvatarDisplay(userAvatar)}
                          alt="Avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                const opponent = opponents[index - 1];
                return (
                  <div key={`slot-${index}`} className="player-slot">
                    {opponent ? (
                      <>
                        <div className="slot-avatar">
                          <img
                            src={getAvatarDisplay(getProfileImageRaw(opponent))}
                            alt="Avatar"
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="slot-empty" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lobby-friends-section">
              <div className="friends-invite-list">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div key={`friend-${friend.id}`} className="friend-card">
                      <div
                        className="friend-profile-hit"
                        onClick={() => onOpenProfile?.(friend.id)}
                      >
                        <div className="friend-info">
                          <span className="friend-name">{friend.name}</span>
                          <span
                            className={`status-indicator ${friend.status}`}
                          ></span>
                        </div>
                      </div>
                      {friend.status === "online" && (
                        <button
                          className="challenge-button"
                          onClick={() => handleChallenge(friend.id)}
                          disabled={challengeId === friend.id}
                        >
                          {challengeId === friend.id ? "..." : "Retar"}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-results">No se han encontrado amigos</p>
                )}
              </div>
            </div>

            <div className="lobby-actions">
              <button className="start-game-btn" onClick={handleStartLobbyGame}>
                Empezar
              </button>
            </div>

            <div className="lobby-code-display">{roomCode}</div>
          </div>
        </div>
      )}

      {showPlayOptions && (
        <div className="lobby-overlay">
          <div className="lobby-modal selection-modal">
            <button
              className="close-button"
              onClick={() => setShowPlayOptions(false)}
            >
              X
            </button>

            <h2 className="selection-title">
              {modeChosen === "classic" ? "MODO CLÁSICO" : "MODO ARCADE"}
            </h2>

            <div className="selection-options-container">
              {/* Buscar partida (Matchmaking) */}
              <div
                className="selection-card"
                onClick={() => handleQuickMatch(modeChosen)}
              >
                <div className="selection-icon">🌍</div>
                <h3>Partida Pública</h3>
                <p>Buscar una mesa libre para jugar ahora</p>
              </div>

              {/* Crear partida privada */}
              <div
                className="selection-card"
                onClick={() => handleCreatePrivateGame(modeChosen)}
              >
                <div className="selection-icon">🔑</div>
                <h3>Crear Partida Privada</h3>
                <p>Genera un código para invitar a un amigo</p>
              </div>

              {/* Unirse a partida privada*/}
              <div className="selection-card join-card">
                <div className="selection-icon">⌨</div>
                <h3>Unirse con Código</h3>
                <div className="join-input-wrapper">
                  <input
                    type="text"
                    placeholder="RUM-000"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleJoinByCode}>ENTRAR</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResumeModal && (
        <div className="lobby-overlay">
          <div className="lobby-modal resume-modal">
            <button
              className="close-button"
              onClick={() => setShowResumeModal(false)}
            >
              X
            </button>

            <h2 className="selection-title" style={{ color: "#058b90" }}>
              PARTIDAS PAUSADAS
            </h2>

            <div className="resume-list-container">
              {user.partidasPendientes > 0 ? (
                <PendingGames
                  userId={user.id}
                  userAvatar={getAvatarDisplay(userAvatar)}
                  selectedGame={selectedGame}
                  setSelectedGame={async (game) => {
                    try {
                      const exito = await gameService.resumeGame(
                        game.idPartida,
                      );

                      if (exito) {
                        setSelectedGame(game);
                        onStart(game.idPartida);
                        setShowResumeModal(false);
                      } else {
                        alert("No se pudo reanudar la partida.");
                      }
                    } catch (error) {
                      console.error("Error al reanudar:", error);
                      alert("Error de conexión al intentar reanudar.");
                    }
                  }}
                  onInvite={() => setActivePopup("friends")}
                />
              ) : (
                <p
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  No tienes partidas pendientes en este momento.
                </p>
              )}
            </div>

            {selectedGame && (
              <button
                className="resume-confirm-btn"
                onClick={() => onStart(selectedGame.idPartida)}
              >
                REANUDAR PARTIDA #{selectedGame.idPartida}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Selector de modos de juego */}
      <div className="gamemodes">
        <div
          className={`gamemode-card classic ${selectedGame ? "" : ""} ${selectedGame && selectedGame.mode !== "classic" ? "disabled" : ""}`}
          onClick={() => {
            setModeChosen("classic");
            setShowPlayOptions(true);
          }}
        >
          <div className="gamemode-glow" />
          <div className="gamemode-icon">
            <svg viewBox="0 0 100 120" className="tile-icon">
              <rect
                x="10"
                y="10"
                width="80"
                height="100"
                rx="8"
                className="tile-back"
              />
              <rect
                x="18"
                y="18"
                width="64"
                height="84"
                rx="5"
                className="tile-front"
              />
              <text x="50" y="72" textAnchor="middle" className="tile-number">
                7
              </text>
            </svg>
          </div>
          <h2 className="gamemode-title">Modo Clásico</h2>
          <p className="gamemode-desc">Las reglas de siempre</p>
          <span className="gamemode-badge">
            {selectedGame && selectedGame.mode === "classic"
              ? "CONTINUAR"
              : "JUGAR"}
          </span>
        </div>

        <div
          className={`gamemode-card arcade ${selectedGame && selectedGame.mode !== "arcade" ? "disabled" : ""}`}
          onClick={() => {
            setModeChosen("arcade");
            setShowPlayOptions(true);
          }}
        >
          <div className="gamemode-glow" />
          <div className="gamemode-icon">
            <svg viewBox="0 0 100 120" className="tile-icon">
              <rect
                x="10"
                y="10"
                width="80"
                height="100"
                rx="8"
                className="tile-back"
              />
              <rect
                x="18"
                y="18"
                width="64"
                height="84"
                rx="5"
                className="tile-front"
              />
              <text x="50" y="72" textAnchor="middle" className="tile-number">
                ★
              </text>
            </svg>
          </div>
          <h2 className="gamemode-title">Modo Arcade</h2>
          <p className="gamemode-desc">Power-ups y caos</p>
          <span className="gamemode-badge">
            {selectedGame && selectedGame.mode === "arcade"
              ? "CONTINUAR"
              : "JUGAR"}
          </span>
        </div>

        <div
          className="gamemode-card resume"
          onClick={() => {
            setShowResumeModal(true);
          }}
        >
          <div className="gamemode-glow" />
          <div className="gamemode-icon">
            <svg viewBox="0 0 100 120" className="tile-icon">
              <rect
                x="10"
                y="10"
                width="80"
                height="100"
                rx="8"
                className="tile-back"
              />
              <rect
                x="18"
                y="18"
                width="64"
                height="84"
                rx="5"
                className="tile-front"
              />
              <text x="50" y="72" textAnchor="middle" className="tile-play">
                ⯈
              </text>
            </svg>
          </div>
          <h2 className="gamemode-title">Reanudar Partida</h2>
          <p className="gamemode-desc">Termina lo que empezaste</p>
          <span className="gamemode-badge">
            {selectedGame && selectedGame.mode === "arcade"
              ? "CONTINUAR"
              : "JUGAR"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;

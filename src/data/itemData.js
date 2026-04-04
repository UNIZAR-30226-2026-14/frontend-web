import alex from "../assets/avatars/alex.png"
import dani from "../assets/avatars/dani.png";
import dian from "../assets/avatars/dian.png";
import fernando from "../assets/avatars/fernando.png";
import gonzalo from "../assets/avatars/gonzalo.png";
import miguel from "../assets/avatars/miguel.png";

export const POWER_UPS = [
  {
    id: "plus4",
    name: "+4",
    price: 400,
    description: "Obliga al oponente a robar 4 fichas extra."
  },
  {
    id: "guardianAngel",
    name: "Ángel de la guarda",
    price: 600,
    description: "Te protege del próximo ataque que recibas."
  },
  {
    id: "swap",
    name: "Intercambio",
    price: 800,
    description: "Ves 3 fichas del oponente que selecciones, escoges una y la intercambias con una tuya."
  },
  {
    id: "magnifyingGlass",
    name: "Lupa de la Verdad",
    price: 300,
    description: "Ver todas las fichas y objetos del jugador que selecciones."
  },
  {
    id: "halfTime",
    name: "Reloj de Arena",
    price: 250,
    description: "Reduce a la mitad el tiempo del turno del oponente que selecciones."
  },
  {
    id: "midasTouch",
    name: "Toque de Midas",
    price: 1000,
    description: "Tus jugadas de este turno valen el doble de puntos."
  },
  {
    id: "smokeBomb",
    name: "Bomba de Humo",
    price: 500,
    description: "Oculta las fichas del tablero al jugador que selecciones durante su siguiente turno."
  },
  {
    id: "tooManyDrinks",
    name: "Dos copas de más",
    price: 450,
    description: "Elige un oponente al que invertir los controles."
  },
  {
    id: "crystalBall",
    name: "Bola de Cristal",
    price: 700,
    description: "Ver las fichas de un color específico del resto de oponentes."
  }
];

export const AVATAR_LIST = [
  { id: 1, url: alex, name: "Alex" },
  { id: 2, url: dani, name: "Dani" },
  { id: 3, url: dian, name: "Dian" },
  { id: 4, url: fernando, name: "Fernando" },
  { id: 5, url: gonzalo, name: "Gonzalo" },
  { id: 6, url: miguel, name: "Miguel" },
];

export const PENDING_GAMES = [
  {
    id: "game1",
    mode: "classic",
    turn: "Maria_Rumi",
    turnNumber: 8,
    date: "31 mar 2026, 14:32",
    players: [
      { name: "Tú", avatar: null },
      {
        name: "Maria_Rumi",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      {
        name: "JugadorPro",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro",
      },
    ],
  },
  {
    id: "game2",
    mode: "classic",
    turn: "Tú",
    turnNumber: 5,
    date: "30 mar 2026, 21:10",
    players: [
      {
        name: "Lucas G.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      },
      { name: "Tú", avatar: null },
    ],
  },
];

export const PARTY_PREVIEW_SLOTS = [
  { name: "Tú", avatar: null },
  {
    name: "Maria_Rumi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  { name: "Invitar", avatar: null, isInviteSlot: true },
];
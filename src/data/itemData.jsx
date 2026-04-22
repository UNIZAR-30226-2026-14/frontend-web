import alex from "../assets/avatars/alex.png";
import dani from "../assets/avatars/dani.png";
import dian from "../assets/avatars/dian.png";
import fernando from "../assets/avatars/fernando.png";
import gonzalo from "../assets/avatars/gonzalo.png";
import miguel from "../assets/avatars/miguel.png";

export const BACKGROUNDS = [
  {
    id: "classic",
    name: "Verde Clásico",
    price: 0,
    value: "#2e7d32",
    owned: true,
  },
  {
    id: "midnight",
    name: "Azul Nocturno",
    price: 500,
    value: "#1a237e",
    owned: false,
  },
  {
    id: "lava",
    name: "Rojo Candente",
    price: 1000,
    value: "#d32f2f",
    owned: false,
  },
  {
    id: "gold",
    name: 'Oro, "Pa que aiga lujo"',
    price: 5000,
    value: "gold",
    owned: false,
  },
];

export const TILE_SKINS = [
  { id: "default", name: "Original", price: 0, value: "skin-default" },
  { id: "neon", name: "Cibernético", price: 800, value: "skin-neon" },
  { id: "marble", name: "Mármol Real", price: 2000, value: "skin-marble" },
];

export const POWER_UPS = [
  {
    id: "plus4",
    name: "+4",
    price: 400,
    description: "Obliga al oponente a robar 4 fichas extra.",
  },
  {
    id: "guardianAngel",
    name: "Ángel de la guarda",
    price: 600,
    description: "Te protege del próximo ataque que recibas.",
  },
  {
    id: "swap",
    name: "Intercambio",
    price: 800,
    description:
      "Ves 3 fichas del oponente que selecciones, escoges una y la intercambias con una tuya.",
  },
  {
    id: "magnifyingGlass",
    name: "Lupa de la Verdad",
    price: 300,
    description: "Ver todas las fichas y objetos del jugador que selecciones.",
  },
  {
    id: "halfTime",
    name: "Reloj de Arena",
    price: 250,
    description:
      "Reduce a la mitad el tiempo del turno del oponente que selecciones.",
  },
  {
    id: "midasTouch",
    name: "Toque de Midas",
    price: 1000,
    description: "Tus jugadas de este turno valen el doble de puntos.",
  },
  {
    id: "smokeBomb",
    name: "Bomba de Humo",
    price: 500,
    description:
      "Oculta las fichas del tablero al jugador que selecciones durante su siguiente turno.",
  },
  {
    id: "tooManyDrinks",
    name: "Dos copas de más",
    price: 450,
    description: "Elige un oponente al que invertir los controles.",
  },
  {
    id: "crystalBall",
    name: "Bola de Cristal",
    price: 700,
    description:
      "Ver las fichas de un color específico del resto de oponentes.",
  },
];

export const AVATAR_LIST = [
  { id: 1, url: alex, name: "Alex" },
  { id: 2, url: dani, name: "Dani" },
  { id: 3, url: dian, name: "Dian" },
  { id: 4, url: fernando, name: "Fernando" },
  { id: 5, url: gonzalo, name: "Gonzalo" },
  { id: 6, url: miguel, name: "Miguel" },
];

export const getAvatarDisplay = (avatarId) => {
  const found = AVATAR_LIST.find((a) => String(a.id) === String(avatarId));
  return found ? found.url : alex;
};

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

export const icons = {
  plus4: (
    <g transform="scale(0.5) translate(50, 20)">
      <rect
        x="0"
        y="0"
        width="100"
        height="160"
        rx="5"
        stroke="black"
        strokeWidth="5"
        fill="none"
      />
      <path
        d="M 10 115 L 30 115 M 20 105 L 20 125"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 80 140 L 80 50 L 40 120 L 90 120"
        fill="none"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  ),
  guardianAngel: (
    <g transform="translate(30, 60) scale(0.6)">
      <ellipse
        rx="20"
        ry="8"
        cx="20"
        cy="-80"
        strokeWidth="6"
        stroke="black"
        fill="none"
      />
      <circle cx="20" cy="-35" r="20" fill="currentColor" />
      <path d="M -70 0 C -70 70 20 70 20 0 Z" fill="currentColor" />
      <path d="M 20 0 C 20 70 110 70 110 0 Z" fill="currentColor" />
      <path d="M -30 100 C -30 -30 70 -30 70 100 Z" fill="white" />
    </g>
  ),
  swap: (
    <g transform="scale(2.5) translate(2, 2)">
      <path d="M0 30.016v-8q0-0.832 0.576-1.408t1.44-0.608h8q0.8 0 1.408 0.608t0.576 1.408v8q0 0.832-0.576 1.408t-1.408 0.576h-8q-0.832 0-1.44-0.576t-0.576-1.408zM0.032 10.368q-0.096-0.608 0.128-1.152t0.704-0.864 1.152-0.352h1.984q0-2.464 1.76-4.224t4.256-1.76h4q0.704 0 1.216 0.416t0.64 0.992 0 1.184-0.64 0.992-1.216 0.416h-4q-0.832 0-1.44 0.576t-0.576 1.408h2.016q0.64 0 1.152 0.384t0.704 0.864 0.096 1.12-0.544 1.056l-4 4q-0.64 0.608-1.44 0.608t-1.376-0.608l-4-4q-0.48-0.448-0.576-1.056zM4 28h4v-4h-4v4zM16.128 28.608q-0.096-0.608 0-1.184t0.64-0.992 1.248-0.416h4q0.8 0 1.408-0.576t0.576-1.44h-1.984q-0.672 0-1.184-0.352t-0.704-0.896-0.096-1.12 0.576-1.024l4-4q0.608-0.608 1.408-0.608t1.408 0.576l4 4q0.48 0.48 0.576 1.088t-0.16 1.12-0.704 0.864-1.12 0.352h-2.016q0 2.496-1.76 4.256t-4.224 1.76h-4q-0.736 0-1.248-0.416t-0.64-0.992zM20 10.016v-8q0-0.832 0.576-1.408t1.44-0.608h8q0.8 0 1.408 0.608t0.576 1.408v8q0 0.832-0.576 1.408t-1.408 0.576h-8q-0.832 0-1.44-0.576t-0.576-1.408zM24 8h4v-4h-4v4z" />
    </g>
  ),
  magnifyingGlass: (
    <g transform="scale(0.4) translate(10, 10)">
      <line
        x1="100"
        y1="120"
        x2="200"
        y2="220"
        stroke="gray"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <circle cx="100" cy="120" r="80" fill="gray" />
      <circle cx="100" cy="120" r="70" fill="#A1F7F6" />
    </g>
  ),
  halfTime: (
    <g transform="translate(50, 50)">
      <line
        x1="-30"
        y1="40"
        x2="30"
        y2="40"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1="-30"
        y1="-40"
        x2="30"
        y2="-40"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line x1="-25" y1="-40" x2="25" y2="40" stroke="black" strokeWidth="4" />
      <line x1="25" y1="-40" x2="-25" y2="40" stroke="black" strokeWidth="4" />
      <path
        d="M 30 20 A 15 15 0 0 1 30 50 Z"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M 30 20 A 15 15 0 0 0 30 50 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
    </g>
  ),
  midasTouch: (
    <g transform="scale(0.5) translate(150, 60)">
      <style>{`.lingote { stroke: black; stroke-width: 2; fill: #Efb810; }`}</style>
      <g transform="translate(-200, 50)">
        <path
          className="lingote"
          d="M 0 20 L 40 20 L 100 -30 L 90 -50 L 70 -50 L 10 0 L 30 0 L 40 20 M 30 0 L 90 -50 M 10 0 L 0 20"
        />
        <path className="lingote" d="M 0 20 L 40 20 L 30 0 L 10 0" />
      </g>
      <g transform="translate(-160, 50)">
        <path
          className="lingote"
          d="M 0 20 L 40 20 L 100 -30 L 90 -50 L 70 -50 L 10 0 L 30 0 L 40 20 M 30 0 L 90 -50 M 10 0 L 0 20"
        />
        <path className="lingote" d="M 0 20 L 40 20 L 30 0 L 10 0" />
      </g>
      <g transform="translate(-180, 30)">
        <path
          className="lingote"
          d="M 0 20 L 40 20 L 100 -30 L 90 -50 L 70 -50 L 10 0 L 30 0 L 40 20 M 30 0 L 90 -50 M 10 0 L 0 20"
        />
        <path className="lingote" d="M 0 20 L 40 20 L 30 0 L 10 0" />
      </g>
    </g>
  ),
  smokeBomb: (
    <g transform="translate(50, 65) scale(0.7)">
      <path
        d="M 0 -60 C 0 -100 50 -100 50 -60"
        fill="none"
        stroke="#8B4513"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="-15" y="-65" width="30" height="20" rx="2" fill="#333" />
      <circle r="50" fill="#222" />
      <g fill="gray">
        <circle r="20" />
        <circle r="25" cx="15" cy="15" />
        <circle r="40" cx="-30" cy="20" />
        <circle r="23" cy="40" />
        <circle r="35" cx="50" cy="20" />
      </g>
    </g>
  ),
  tooManyDrinks: (
    <g transform="translate(50, 60) scale(0.6)">
      <path
        d="M 15 50 L 25 -10"
        fill="none"
        stroke="#e74c3c"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M -36 -10 L -30 60 A 30 7 0 0 0 30 60 L 36 -10 Z"
        fill="#F5B427"
        fillOpacity="0.5"
        stroke="#5FB8D1"
        strokeWidth="2"
      />
      <path
        d="M -36 -10 L -40 -50 M 36 -10 L 40 -50"
        stroke="#5FB8D1"
        strokeWidth="2"
      />
      <ellipse
        cx="0"
        cy="-10"
        rx="36"
        ry="6"
        fill="#F5B427"
        fillOpacity="0.7"
        stroke="#5FB8D1"
        strokeWidth="1"
      />
      <path
        d="M 32 -50 L 65 -65"
        fill="none"
        stroke="#e74c3c"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  ),
  crystalBall: (
    <g transform="scale(0.5) translate(10, -20)">
      <circle cx="100" cy="120" r="70" fill="#A1F7F6" />
      <rect x="65" y="180" width="70" height="20" fill="#BD721C" />
    </g>
  ),
};

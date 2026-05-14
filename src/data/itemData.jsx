const DICEBEAR = "https://api.dicebear.com/7.x/avataaars/svg";

export const defaultAvatarUrl = `${DICEBEAR}?seed=Alex&backgroundColor=b6e3f4`;

const precio = 0; //6
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
    <g transform="scale(0.6) translate(200, 60)">
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
  crystalBall: (
    <g transform="scale(0.5) translate(10, -20)">
      <circle cx="100" cy="120" r="70" fill="#A1F7F6" />
      <rect x="65" y="180" width="70" height="20" fill="#BD721C" />
    </g>
  ),
  glove: (
  <g transform="translate(10, 90) scale(0.005, -0.005)">
    <path 
      fill="currentColor" 
      d="M9425 18230 c-154 -21 -331 -83 -471 -165 -301 -178 -523 -489 -593 -830 -5 -27 -13 -63 -17 -80 -4 -16 -10 -963 -13 -2103 l-6 -2074 -169 824 c-93 452 -200 972 -237 1153 -37 182 -102 497 -144 700 -90 441 -96 464 -141 582 -64 166 -159 308 -302 445 -239 230 -533 348 -867 348 -479 0 -901 -263 -1119 -697 -103 -206 -151 -469 -127 -687 10 -88 1168 -5738 1206 -5886 17 -65 20 -175 5 -165 -5 3 -201 245 -436 538 -242 301 -467 571 -519 623 -188 186 -415 307 -688 366 -134 29 -387 31 -519 5 -299 -60 -582 -223 -773 -445 -161 -187 -263 -394 -317 -640 -31 -141 -31 -405 0 -550 39 -178 109 -345 207 -490 24 -37 343 -436 707 -887 365 -451 1120 -1385 1678 -2075 1102 -1364 1223 -1512 1347 -1641 l83 -86 0 -60 0 -60 -50 -6 c-216 -26 -353 -285 -417 -789 -24 -189 -24 -767 0 -956 46 -362 120 -576 242 -699 63 -62 127 -93 196 -93 l28 0 3 -299 c3 -283 4 -301 23 -327 11 -15 36 -35 55 -45 34 -18 132 -19 2946 -19 l2911 0 33 22 c18 13 43 36 54 51 l21 28 3 1613 2 1613 52 24 c29 13 86 49 128 80 620 458 930 1936 930 4440 l0 427 51 133 c56 148 230 609 906 2399 250 663 504 1335 564 1495 127 335 146 399 161 552 45 430 -163 862 -530 1106 -98 65 -254 136 -357 163 -123 31 -309 42 -438 25 -388 -52 -733 -296 -907 -641 -18 -35 -145 -361 -282 -725 -137 -363 -252 -662 -255 -665 -3 -3 -3 9 0 25 3 17 117 572 252 1235 137 670 250 1250 256 1307 17 184 -18 410 -90 585 -154 370 -469 643 -858 744 -131 35 -363 44 -499 20 -408 -71 -760 -338 -933 -707 -70 -148 -58 -94 -415 -1849 -69 -338 -130 -628 -135 -645 -5 -18 -9 617 -10 1612 -1 1104 -4 1667 -12 1718 -56 409 -306 766 -666 953 -220 114 -496 163 -738 132z m337 -304 c356 -69 632 -322 745 -683 l28 -88 5 -2450 5 -2450 23 -36 c59 -96 204 -90 255 11 9 19 188 872 397 1895 209 1023 390 1892 401 1930 129 432 570 726 1014 675 409 -47 733 -339 832 -752 26 -108 23 -321 -6 -453 -12 -55 -49 -230 -81 -390 -33 -159 -84 -411 -114 -560 -30 -148 -192 -944 -361 -1769 -168 -824 -305 -1514 -305 -1533 0 -19 7 -50 16 -69 43 -90 190 -101 248 -18 8 10 275 710 594 1554 319 844 590 1557 601 1583 105 244 358 444 631 502 95 20 272 19 363 -1 85 -19 230 -85 314 -142 225 -153 368 -412 380 -692 9 -187 -1 -223 -242 -860 -117 -311 -487 -1292 -823 -2180 l-610 -1615 -6 -495 c-7 -523 -20 -967 -36 -1265 -86 -1554 -316 -2506 -695 -2880 -75 -75 -150 -119 -256 -154 -70 -23 -101 -48 -118 -94 -8 -20 -11 -513 -11 -1608 l0 -1579 -2725 0 -2725 0 0 195 0 195 2113 0 c2412 0 2169 -10 2272 94 124 126 193 325 241 701 26 195 26 759 1 950 -49 375 -119 577 -242 702 -102 103 132 93 -2277 93 l-2108 0 0 103 c0 56 -4 117 -9 135 -7 21 -48 70 -124 145 -143 141 -108 98 -1372 1662 -582 721 -1333 1648 -1667 2062 -335 414 -633 785 -664 825 -73 97 -148 250 -181 373 -25 91 -27 116 -27 275 0 157 3 185 27 272 127 476 552 808 1032 808 273 0 528 -99 730 -283 34 -30 326 -385 650 -788 325 -403 604 -741 620 -751 40 -24 111 -23 153 2 19 12 41 38 52 63 18 38 20 68 20 337 0 238 -3 307 -16 355 -8 33 -283 1358 -610 2945 -468 2267 -597 2907 -601 2986 -29 511 343 953 853 1015 212 25 459 -38 643 -164 68 -46 189 -165 237 -232 50 -70 118 -208 139 -280 8 -27 107 -500 220 -1050 113 -550 289 -1405 391 -1900 102 -495 221 -1075 265 -1290 52 -253 87 -401 100 -421 52 -85 189 -84 246 3 17 26 18 152 23 2878 l5 2850 23 85 c27 96 94 245 142 315 45 66 145 170 211 221 112 86 281 161 411 183 84 14 259 12 340 -3z m1921 -14044 c51 -56 113 -269 144 -492 23 -170 26 -744 5 -905 -31 -232 -88 -458 -130 -512 l-17 -22 -2247 -1 c-1236 -1 -2252 2 -2258 5 -19 12 -59 103 -85 192 -60 208 -86 440 -86 778 0 413 55 765 144 920 l23 40 1809 5 c996 3 2006 6 2246 8 407 2 437 1 452 -16z"
    />
    <path 
      fill="currentColor" 
      d="M7170 8979 c-44 -27 -57 -45 -70 -91 -15 -53 2 -109 44 -145 25 -23 53 -34 122 -47 397 -78 939 -265 1339 -461 921 -452 1494 -1071 1689 -1825 37 -144 54 -176 107 -202 66 -34 142 -13 187 52 36 53 28 120 -43 353 -194 642 -672 1222 -1355 1647 -501 311 -1116 559 -1732 699 -194 44 -244 48 -288 20z"
    />
    <path 
      fill="currentColor" 
      d="M11930 8794 c-75 -25 -260 -119 -340 -173 -190 -126 -388 -313 -560 -527 -173 -215 -423 -616 -437 -699 -17 -102 83 -191 185 -163 53 14 76 39 133 147 70 131 185 311 281 439 260 346 523 570 805 683 120 48 144 73 151 153 3 41 -1 58 -20 86 -44 65 -111 83 -198 54z"
    />
  </g>
  ),
  // Dentro de tu objeto icons = { ... }
hearing: (
  <g transform="translate(10, 90) scale(0.025, -0.025)">
    {/* Onda de sonido superior */}
    <path 
      fill="currentColor" 
      d="M5985 9751 c-408 -47 -723 -125 -1117 -275 -211 -80 -548 -254 -758 -391 -111 -72 -240 -168 -240 -178 0 -5 28 -46 63 -91 35 -44 115 -148 177 -231 242 -319 231 -305 249 -295 9 6 36 26 61 44 117 88 399 253 565 330 250 117 547 211 819 261 251 46 398 58 641 51 260 -6 359 -17 560 -57 611 -122 1153 -414 1675 -900 76 -71 152 -147 170 -169 l32 -40 -586 0 -586 0 0 -389 0 -388 183 -8 c100 -5 639 -9 1197 -9 l1015 -1 3 1188 2 1187 -400 0 -400 0 0 -430 c0 -236 -4 -430 -8 -430 -4 0 -24 16 -43 36 -18 20 -83 80 -144 133 -664 588 -1423 939 -2255 1042 -240 30 -657 35 -875 10z"
    />
    {/* Estructura de la oreja principal */}
    <path 
      fill="currentColor" 
      d="M3345 8335 c-16 -12 -120 -89 -230 -170 -110 -82 -281 -208 -380 -282 -396 -293 -549 -406 -740 -548 -110 -81 -221 -164 -247 -183 l-48 -36 0 -247 0 -247 116 -154 c64 -84 121 -153 127 -153 12 0 72 44 474 343 l206 153 -7 -48 c-77 -530 -91 -721 -83 -1102 6 -290 13 -371 52 -616 94 -588 330 -1159 674 -1629 133 -183 229 -295 401 -467 331 -333 655 -578 1097 -832 161 -93 363 -200 367 -196 7 8 356 698 356 703 0 3 -48 30 -108 60 -510 256 -1008 639 -1328 1021 -378 452 -603 970 -686 1580 -20 148 -23 211 -23 490 0 369 18 554 85 921 22 118 40 216 40 219 0 18 23 -4 67 -62 67 -90 296 -392 393 -518 42 -55 118 -155 169 -223 62 -81 98 -119 105 -113 6 4 49 36 96 71 l84 62 31 -34 c16 -18 46 -53 65 -77 35 -43 35 -43 58 -24 20 16 22 22 13 46 -15 39 -14 83 3 116 51 98 275 208 522 257 131 26 422 25 521 -2 l72 -20 -17 29 c-37 63 -139 122 -267 154 -98 24 -384 24 -509 -1 -249 -49 -471 -159 -523 -259 -14 -28 -14 -46 -1 -130 2 -11 -6 -25 -18 -33 -20 -14 -30 -3 -232 245 -117 143 -212 265 -212 271 0 21 47 34 79 20 51 -21 98 -15 154 21 122 76 217 129 290 160 42 18 77 36 77 39 0 6 -93 129 -562 745 -66 88 -191 252 -277 365 -85 113 -174 230 -197 261 -61 79 -64 81 -99 54z"
    />
    {/* Detalle interno y canal auditivo */}
    <path 
      fill="currentColor" 
      d="M9707 6163 c-4 -38 -7 -106 -7 -153 0 -47 -7 -143 -15 -215 -15 -139 -63 -453 -71 -466 -2 -4 -16 -59 -29 -121 -14 -62 -46 -178 -71 -258 -327 -1036 -1015 -1769 -1984 -2112 -100 -36 -309 -98 -328 -98 -8 0 85 193 223 466 130 256 235 468 232 470 -10 10 -669 334 -690 339 -26 7 17 87 -492 -920 -136 -269 -299 -590 -362 -713 -62 -123 -111 -227 -109 -231 3 -4 81 -63 173 -132 92 -68 254 -187 358 -264 386 -286 546 -405 804 -595 144 -107 297 -221 340 -252 42 -31 101 -75 132 -97 l57 -41 88 117 c49 65 155 205 237 311 81 107 147 198 147 202 0 5 -15 19 -32 31 -18 13 -145 107 -283 209 -137 102 -303 224 -367 270 -64 47 -117 89 -117 93 -1 4 5 9 12 11 76 21 296 97 387 133 762 301 1376 799 1827 1478 121 183 288 492 351 651 11 27 34 85 52 129 199 497 325 1131 333 1665 l2 155 -396 3 -396 2 -6 -67z"
    />
  </g>
),
};


export const BACKGROUNDS = [
  {
    id: "classic",
    name: "Verde Clásico",
    price: 0,
    value: "#1a5e20",
    owned: true,
  },
  {
    id: "midnight",
    name: "Azul Nocturno",
    price: 0,
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
  { id: "default", name: "Original", price: 0, value: "#fdfcf0" },
  { id: "oficina", name: "Gris oficina", price: 800, value: "#454545" },
  { id: "divina", name: "Divina de la Muerte", price: 0, value: "#ca2897" },
];

export const POWER_UPS = [
  {
    id: "PLUS_FOUR",
    name: "+4",
    price: precio,
    description: "Obliga al oponente a robar 4 fichas extra.",
    // Envolvemos el path del objeto 'icons' en un componente SVG
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.plus4}</svg>,
  },
  {
    id: "GUARDIAN_ANGEL",
    name: "Ángel de la guarda",
    price: precio,
    description: "Te protege del próximo ataque que recibas.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.guardianAngel}</svg>,
  },
  {
    id: "SWAP_ON_FAIL",
    name: "Trueque al fallo",
    price: precio,
    description: "Ves 3 fichas del oponente que selecciones, escoges una y la intercambias con una tuya.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.swap}</svg>,
  },
  {
    id: "MIDAS_TOUCH",
    name: "Toque de Midas",
    price: 3,
    description: "Tus jugadas de este turno valen el doble de puntos.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.midasTouch}</svg>,
  },
  {
    id: "SMOKE_BOMB",
    name: "Bomba de Humo",
    price: precio,
    description: "Oculta las fichas del tablero al jugador que selecciones durante su siguiente turno.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.smokeBomb}</svg>,
  },
  {
    id: "CRYSTAL_BALL",
    name: "Bola de Cristal",
    price: precio,
    description: "Ver las fichas de un color específico del resto de oponentes.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.crystalBall}</svg>,
  },
  {
    id: "WHITE_GLOVE",
    name: "Guante Blanco",
    price: precio,
    description: "Ver las fichas de un color específico del resto de oponentes.",
    icon: <svg width="1%" height="1%" viewBox="0 0 100 100">{icons.glove}</svg>, // Usando lupa para el guante
  },
  {
    id: "CHILI_PEPPER",
    name: "GUINDILLA EN EL CULO",
    price: precio,
    description: "Reducir a la mitad el tiempo del próximo turno de un jugador.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.halfTime}</svg>,
  },
  {
    id: "GLASS_CEILING",
    name: "Techo de cristal",
    price: precio,
    description: "Hacer que la siguiente jugada de un jugador deba ser de 30 puntos o más.",
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.hearing}</svg>, // Usando el de drinks como placeholder
  },
];

export const AVATAR_LIST = [
  { id: 1, url: `${DICEBEAR}?seed=Alex&backgroundColor=b6e3f4`, name: "alex" },
  { id: 2, url: `${DICEBEAR}?seed=Dani&backgroundColor=c0aede`, name: "dani" },
  { id: 3, url: `${DICEBEAR}?seed=Dian&backgroundColor=d1d4f9`, name: "dian" },
  {
    id: 4,
    url: `${DICEBEAR}?seed=Fernando&backgroundColor=ffd5dc`,
    name: "fernando",
  },
  {
    id: 5,
    url: `${DICEBEAR}?seed=Gonzalo&backgroundColor=ffdfbf`,
    name: "gonzalo",
  },
  {
    id: 6,
    url: `${DICEBEAR}?seed=Miguel&backgroundColor=c0aede`,
    name: "miguel",
  },
];

/** Claves habituales en JSON (Spring / front) para la foto o id de preset.
 *  La primera coincidencia no vacía gana — las más específicas van primero.
 *  Confirmado por el backend: el DTO Jugador usa "imagenPerfil";
 *  el DTO Participacion usa "jugadorImagenPerfil". */
const PROFILE_IMAGE_KEYS = [
  "imagenPerfil",
  "jugadorImagenPerfil",
  "urlImgPerfil",
  "urlImagenPerfil",
  "urlimagenPerfil",
  "url_imagen_perfil",
  "avatarId",
  "idAvatar",
  "fotoPerfil",
];

/**
 * Obtiene el valor crudo de imagen de perfil desde un jugador o DTO anidado.
 */
export function getProfileImageRaw(entity) {
  if (entity == null) {
    return undefined;
  }
  if (typeof entity !== "object") {
    return entity;
  }
  for (const k of PROFILE_IMAGE_KEYS) {
    if (
      Object.prototype.hasOwnProperty.call(entity, k) &&
      entity[k] != null &&
      entity[k] !== ""
    ) {
      return entity[k];
    }
  }
  if (entity.jugador && typeof entity.jugador === "object") {
    return getProfileImageRaw(entity.jugador);
  }
  return undefined;
}

export const getAvatarDisplay = (avatarRef) => {
  if (avatarRef == null || avatarRef === "") {
    return defaultAvatarUrl;
  }
  if (typeof avatarRef === "string") {
    const s = avatarRef.trim();
    const isAbsoluteOrAsset =
      s.startsWith("data:") ||
      s.startsWith("http://") ||
      s.startsWith("https://") ||
      s.startsWith("//") ||
      s.startsWith("/") ||
      s.startsWith("./");
    if (isAbsoluteOrAsset) {
      return s.startsWith("//") ? `https:${s}` : s;
    }
  }
  const ref = String(avatarRef).trim();
  const found = AVATAR_LIST.find(
    (a) => String(a.id) === ref || a.name.toLowerCase() === ref.toLowerCase(),
  );
  return found ? found.url : defaultAvatarUrl;
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


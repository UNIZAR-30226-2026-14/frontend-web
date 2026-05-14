const DICEBEAR = "https://api.dicebear.com/7.x/avataaars/svg";

export const defaultAvatarUrl = `${DICEBEAR}?seed=Alex&backgroundColor=b6e3f4`;

const precio = 0; //6
export const icons = {
  PLUS_FOUR: (
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
  <g transform="translate(-3, 112) scale(0.006, -0.006)">
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
  <g transform="translate(0.000000,1284.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
    <path d="M6765 12224 c-127 -4 -392 -28 -545 -50 -261 -37 -371 -57 -619 -116
      -510 -119 -1085 -341 -1520 -585 -51 -29 -95 -53 -97 -53 -1 0 -67 -39 -146
      -87 -169 -104 -358 -232 -358 -243 0 -7 62 -85 478 -602 l184 -228 91 63 c454
      314 1016 567 1578 711 253 65 555 115 818 137 183 15 696 6 876 -15 950 -113
      1798 -495 2575 -1162 161 -138 370 -334 370 -347 0 -4 -367 -7 -815 -7 l-815
      0 0 -525 0 -525 1668 2 1667 3 0 1560 0 1560 -555 0 -555 0 -3 -562 c-1 -310
      -6 -563 -10 -563 -4 0 -26 18 -47 41 -114 117 -517 434 -755 593 -307 205
      -781 459 -1065 571 -66 26 -133 53 -150 60 -59 25 -331 116 -420 140 -49 13
      -135 35 -190 50 -472 127 -1097 195 -1640 179z"/>
    <path d="M2625 10244 c-88 -63 -185 -131 -215 -152 -30 -21 -138 -97 -240
      -168 -102 -72 -216 -153 -255 -179 -113 -79 -387 -272 -420 -295 -30 -22 -250
      -176 -656 -460 -122 -85 -254 -178 -293 -206 l-71 -50 -3 -331 -2 -332 146
      -183 c81 -101 156 -193 168 -205 l21 -23 102 73 c57 39 209 146 338 237 130
      91 295 207 367 258 72 51 133 91 135 88 3 -2 -9 -87 -26 -188 -81 -489 -105
      -797 -98 -1258 6 -406 21 -569 83 -920 46 -263 136 -591 228 -835 92 -242 233
      -545 326 -700 20 -33 54 -89 75 -125 185 -314 477 -680 782 -980 399 -394 749
      -662 1288 -988 275 -167 794 -438 819 -429 7 3 99 169 206 369 106 199 212
      398 236 440 66 120 74 104 -93 187 -888 438 -1554 952 -2029 1566 -127 164
      -287 414 -368 573 -20 40 -41 81 -46 90 -20 35 -83 181 -124 287 -129 332
      -205 653 -253 1065 -24 205 -24 736 0 990 9 102 19 194 22 205 2 11 9 61 15
      110 10 88 71 430 89 510 6 22 17 73 27 113 9 40 20 72 25 70 7 -3 176 -211
      812 -1006 94 -117 176 -211 182 -208 7 2 184 125 394 273 211 147 405 283 432
      302 27 18 49 37 49 42 0 5 -201 260 -447 566 -246 307 -546 682 -667 833 -121
      151 -251 313 -288 360 -38 47 -184 230 -326 407 -141 177 -264 322 -272 322
      -8 -1 -87 -52 -175 -115z"/>
    <path d="M5760 8133 c-263 -40 -492 -125 -720 -267 -58 -36 -114 -67 -125 -67
      -34 -2 -59 2 -88 13 -30 12 -77 -2 -77 -22 0 -6 95 -128 212 -271 202 -248
      212 -259 232 -245 12 8 20 22 18 33 -13 84 -13 102 1 130 52 100 274 210 523
      259 125 25 411 25 509 1 145 -37 233 -93 280 -179 25 -45 29 -64 29 -128 1
      -126 -54 -208 -178 -268 -100 -49 -199 -66 -381 -66 -217 0 -264 16 -301 102
      -12 26 -20 32 -44 32 l-30 0 0 -315 0 -315 30 0 c23 0 32 7 45 33 37 79 186
      110 433 90 333 -28 485 -140 486 -359 0 -68 -4 -90 -27 -136 -107 -219 -492
      -303 -958 -208 -366 75 -616 236 -607 391 3 43 1 47 -25 57 -25 10 -28 8 -41
      -21 -7 -18 -60 -138 -116 -267 -56 -129 -117 -270 -136 -312 l-33 -78 27 -14
      c25 -13 30 -12 70 18 67 47 107 43 277 -33 191 -86 279 -117 420 -151 174 -43
      334 -60 535 -61 313 0 532 46 742 153 291 149 428 358 428 656 0 166 -41 286
      -135 390 -52 57 -153 128 -233 162 l-53 23 38 25 c179 120 270 271 281 468 11
      211 -76 405 -243 543 -108 90 -301 168 -493 201 -139 24 -426 26 -572 3z"/>
    <path d="M8469 8134 c-113 -20 -233 -61 -334 -112 -320 -165 -531 -458 -617
      -857 -20 -97 -23 -136 -23 -335 1 -253 13 -337 81 -531 41 -119 70 -178 130
      -269 247 -374 623 -551 1101 -518 356 24 674 205 871 495 206 303 283 762 197
      1178 -105 506 -464 865 -952 950 -106 19 -350 18 -454 -1z m346 -429 c271 -57
      462 -312 512 -685 20 -150 12 -327 -21 -472 -92 -402 -382 -631 -713 -564
      -145 29 -237 86 -332 204 -142 176 -211 427 -197 722 9 211 54 372 148 527 43
      71 140 169 209 210 109 65 257 87 394 58z"/>
    <path d="M11605 7550 c-3 -6 -10 -110 -15 -233 -9 -221 -30 -450 -50 -556 -6
      -31 -22 -119 -35 -196 -125 -730 -439 -1457 -874 -2025 -524 -684 -1203 -1160
      -2070 -1450 -162 -54 -450 -134 -457 -127 -3 2 22 53 54 113 33 60 83 154 112
      209 29 55 65 123 80 150 15 28 46 86 70 130 56 105 116 218 150 280 15 28 56
      104 90 170 35 66 69 129 77 140 28 41 30 39 -222 155 -33 15 -98 46 -145 67
      -79 37 -240 113 -483 227 -55 25 -106 46 -115 46 -11 0 -33 -30 -61 -82 -24
      -46 -60 -114 -81 -153 -44 -82 -492 -922 -558 -1045 -43 -82 -75 -142 -139
      -260 -17 -30 -52 -95 -78 -145 -26 -49 -60 -112 -75 -140 -15 -27 -52 -97 -82
      -155 -31 -58 -69 -130 -85 -160 -17 -30 -52 -95 -78 -145 -26 -49 -58 -109
      -71 -132 l-23 -42 67 -48 c37 -26 103 -72 147 -103 44 -32 103 -73 130 -92 28
      -19 271 -189 540 -378 270 -189 607 -426 750 -526 143 -100 418 -292 610 -427
      193 -135 353 -243 357 -241 11 7 649 804 654 818 4 11 -85 76 -536 390 -78 55
      -275 193 -493 347 -49 34 -85 65 -80 69 4 4 38 15 75 24 236 58 651 216 974
      371 988 474 1787 1222 2321 2174 79 140 283 558 283 579 0 4 14 40 31 81 257
      611 438 1523 439 2204 l0 127 -549 0 c-359 0 -552 -4 -556 -10z"/>
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
    icon: <svg width="100%" height="100%" viewBox="0 0 100 100">{icons.PLUS_FOUR}</svg>,
  },
  {
    id: "GUARDIAN_ANGEL",
    name: "Angel de la guarda",
    price: precio,
    description: "Te protege del próximo ataque que recibas.",
    icon: <svg width="100%" height="100%" viewBox="0 0 90 110">{icons.guardianAngel}</svg>,
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
    price: 0,
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
    icon: <svg width="100%" height="100%" viewBox="0 0 1361 1284">{icons.hearing}</svg>, // Usando el de drinks como placeholder
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


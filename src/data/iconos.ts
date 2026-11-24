// Trazos SVG (viewBox 0 0 24 24) de los íconos del sitio.
export const ICONOS = {
  key: 'M4 15a4 4 0 1 0 8 0a4 4 0 1 0-8 0M11 12l8-8M16 7l2 2M14 9l2 2',
  search: 'M4 6h10M4 12h7M4 18h6M13 14.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M19 17l2.5 2.5',
  truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M5.5 17.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M15.5 17.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',
  shield: 'M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6zM9 12l2 2 4-4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  audit: 'M14 3H6v18h7M14 3l4 4v4M13 16a3 3 0 1 0 6 0a3 3 0 1 0-6 0M18.2 18.2l2.3 2.3',
  folder: 'M3 7h6l2 2h10v10H3zM3 7V5h6l2 2',
  list: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 9l1.5 1.5L12 8M8 15l1.5 1.5L12 14M14.5 9.5H16M14.5 15.5H16',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  more: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6',
  doc: 'M5 4h11l3 3v13H5zM8 10h8M8 14h8M8 18h5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  external: 'M7 17 17 7M8 7h9v9',
  check: 'm5 12 4 4 10-10',
  chevron: 'm6 9 6 6 6-6',
  menu: 'M4 8h16M4 16h16',
  close: 'M6 6l12 12M18 6L6 18',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14'
} as const;

export type Icono = keyof typeof ICONOS;

# LexQuant Mobile

App React Native (Expo + Expo Router + TypeScript) del dashboard judicial LexQuant.
Por ahora implementa la pantalla **Resumen ejecutivo**; las otras 4 pestañas son placeholders.

## Arrancar

```bash
npm install
npx expo install --fix   # alinea versiones con tu SDK de Expo
npx expo start
```

Escaneá el QR con Expo Go, o presioná `i` / `a` para simulador.

## Estructura

- `app/` rutas (Expo Router). `(tabs)/index.tsx` es Resumen ejecutivo.
- `src/mocks/` datos de ejemplo. **Reemplazalos por los mocks reales del proyecto web.**
- `src/services/` capa de datos: hoy devuelve mocks, mañana hace fetch a FastAPI.
- `src/types.ts` modelo de datos de la pantalla.
- `src/components/` UI reutilizable. `src/theme.ts` colores y tipografía.

## Conectar los mocks reales

1. Copiá tus JSON a `src/mocks/`.
2. Ajustá `src/types.ts` y mapeá en `src/services/resumenService.ts`.
3. La pantalla no cambia: solo consume `getResumenEjecutivo()`.

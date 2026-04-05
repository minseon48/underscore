export type ScreenSize = typeof screenSize
export type ScreenSizeKey = keyof ScreenSize
export type ScreenDevice = typeof screenDevice
export type ScreenDeviceKey = keyof ScreenDevice

export const screenSize = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
}

export const screenDevice = {
  sm: `all and (max-width: ${screenSize.sm})`,
  md: `all and (max-width: ${screenSize.md})`,
  lg: `all and (max-width: ${screenSize.lg})`,
  xl: `all and (max-width: ${screenSize.xl})`,
}

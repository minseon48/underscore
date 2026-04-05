import "styled-components"
import { Color } from "@/styles/theme/color"
import { ScreenDevice, TypeScreenSize } from "@/styles/theme/screen"
import { TypoLeading, TypoSize } from "@/styles/theme/typo"

declare module "styled-components" {
  export interface DefaultTheme
    extends Record<"color", Record<"light", Color>>,
      Record<"screen", Record<"device", ScreenDevice> & Record<"size", TypeScreenSize>>,
      Record<"typo", Record<"leading", TypoLeading> & Record<"size", TypoSize>> {}
}

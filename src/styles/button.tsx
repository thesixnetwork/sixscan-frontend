import { extendTheme, defineStyle, defineStyleConfig } from "@chakra-ui/react";

const solid = defineStyle({
  borderRadius: 12,
});

export const buttonTheme = defineStyleConfig({
  defaultProps: {
    variant: "solid",
    colorScheme: "primary",
  },
  variants: { solid },
});

export default buttonTheme;

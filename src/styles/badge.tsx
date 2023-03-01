import { extendTheme, defineStyle, defineStyleConfig } from "@chakra-ui/react";

const subtle = defineStyle({
  borderRadius: 6,
  px: 2,
  py: 1,
});

export const badgeTheme = defineStyleConfig({
  defaultProps: {
    variant: "subtle",
  },
  variants: { subtle },
});

export default badgeTheme;

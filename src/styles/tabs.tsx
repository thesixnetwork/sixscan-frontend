import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  tab: {
    fontWeight: "semibold", // change the font weight
    _selected: {
      color: "primary.500", // change the color
    },
  },
  tablist: {
    color: "medium", // change the color
  },
  tabpanel: {},
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });

export default tabsTheme;

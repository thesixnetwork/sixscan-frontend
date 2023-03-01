import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  thead: {
    fontWeight: "bold", // change the font weight
  },
});

// export the component theme
export const tableTheme = defineMultiStyleConfig({ baseStyle });

export default tableTheme;

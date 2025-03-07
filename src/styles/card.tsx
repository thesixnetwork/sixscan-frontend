import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "light",
    overflow: "hidden",
  },
  header: {
    padding: 5,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "light",
  },
  body: {
    // paddingTop: '2px',
  },
  footer: {
    padding: 5,
    backgroundColor: "lightest",
    color: "medium",
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
  },
});

const sizes = {
  md: definePartsStyle({
    container: {
      borderRadius: "0px",
    },
  }),
  lg: definePartsStyle({
    container: {
      borderRadius: "12px",
    },
  }),
};

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes });

export default cardTheme;

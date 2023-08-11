import React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface FloatingButtonProps {
  return_url: string;
  button_label: string;
  button_color?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  return_url,
  button_label,
  button_color,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    // Navigate to the specified return URL
    window.location.href = return_url;
  };

  const labelLength = button_label.length + 9;
  const buttonSize = `${Math.max(56, labelLength * 10)}px`; // Minimum size of 56px

  // split button color and background color with comma
  let [labelColor, backgroundColor] = button_color? button_color.split(",") : ["", ""];


  return (
    <Button
      position="fixed"
      bottom="20px"
      right="20px"
      borderRadius="50"
      //   width={buttonSize}
      //   height={buttonSize}
      backgroundColor={backgroundColor ?  backgroundColor : "#464B92"}
      color={labelColor ? labelColor : "white"}
      boxShadow="md"
      onClick={handleButtonClick}
      leftIcon={<Icon as={ArrowBackIcon} />}
    >
      {button_label}
    </Button>
  );
};

export default FloatingButton;

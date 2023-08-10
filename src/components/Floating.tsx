import React from 'react';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const FloatingButton: React.FC = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    // Navigate back to the previous page using Next.js router
    router.back();
  };

  return (
    <Button
      position="fixed"
      bottom="20px"
      right="20px"
      borderRadius="50%"
      width="56px"
      height="56px"
      backgroundColor="teal.500"
      color="white"
      boxShadow="md"
      onClick={handleButtonClick}
    >
      {/* You can put an icon or text inside the button */}
      Back
    </Button>
  );
};

export default FloatingButton;

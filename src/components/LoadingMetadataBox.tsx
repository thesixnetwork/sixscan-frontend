import {
  Flex,
  Text,
  Grid,
  GridItem,
  Skeleton,
  Link,
  Image,
} from "@chakra-ui/react";
import CustomCard from "@/components/CustomCard";

const LoadingMetadataBox = () => {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      {Array.from({ length: 12 }).map((_, index) => (
        <GridItem colSpan={{ base: 6, md: 4, lg: 2 }} key={index}>
          <CustomCard>
            <Skeleton height="228px" width="auto" />
          </CustomCard>
        </GridItem>
      ))}
    </Grid>
  );
};

export default LoadingMetadataBox;

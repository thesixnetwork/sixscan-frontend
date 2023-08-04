import {
    Flex,
    Text,
    Grid,
    GridItem,
    Skeleton,
    Link,
    Image,
} from "@chakra-ui/react";
import { formatTraitValue } from "@/utils/format";
import CustomCard from "@/components/CustomCard";
import { motion } from "framer-motion";
import { LinkComponent } from "@/components/Chakralink";
import { useEffect, useState } from 'react';
import { getNftCollectionByClient } from "@/service/nftmngr/collection";

interface Data {
    schema: string;
    isPage: string;
}

interface NFTMetadata {
    metadata: any[];
    pagegination: string;
}

const MetadataBox = ({ schema, isPage }: Data) => {
    const [metadata, setMetadata] = useState<NFTMetadata | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/metadata?schemaCode=${schema}&isPage=${isPage}`);
                const data = await response.json();
                setMetadata(data);
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };

        fetchData();
    }, [schema, isPage]);
    // console.log(metadata)

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {metadata?.metadata?.map((items, index) => (
                <GridItem
                    colSpan={{ base: 6, md: 4, lg: 2 }}
                    key={index}
                >
                    <CustomCard>
                        <Link
                            href={`/schema/${schema}/${items.token_id}`}
                            _hover={{
                                textDecoration: "none",
                            }}
                            as={LinkComponent}
                        >
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Image
                                    src={
                                        items.image ? items.image : "/logo-nftgen2-01.png"
                                    }
                                    alt="mfer"
                                    width="100%"
                                />
                            </motion.div>
                            <Flex direction="column" p={2}>
                                <Flex
                                    direction="row"
                                    gap={2}
                                    align="center"
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color="dark"
                                    >
                                        #
                                    </Text>
                                    <Text fontSize="sm" color={"primary.500"}>
                                        {items.token_id}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Link>
                    </CustomCard>
                </GridItem>
            ))}
        </Grid>
    );
};


export default MetadataBox;

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import UptimeGrid from "@/components/UptimeGrid";
import { consensusPubkeyToHexAddress } from "@/libs/address/address";

interface ValidatorData {
  operator_address: string;
  consensus_pubkey: {
    "@type": string;
    key: string;
  };
  description: {
    moniker: string;
  };
  status: string;
  tokens: string;
}

interface BlockSignature {
  validator_address: string;
}

export default function UptimePage() {
  const [validators, setValidators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch validators
        const [validatorsRes, latestBlockRes] = await Promise.all([
          fetch(
            "https://api1.fivenet.sixprotocol.net/cosmos/staking/v1beta1/validators"
          ),
          fetch("https://rpc1.fivenet.sixprotocol.net/block"),
        ]);

        const validatorsData = await validatorsRes.json();
        const latestBlock = await latestBlockRes.json();

        const latestHeight = parseInt(latestBlock.result.block.header.height);

        // Get last 50 blocks
        const blockPromises = [];
        for (let i = 0; i < 50; i++) {
          if (latestHeight - i <= 0) break;
          blockPromises.push(
            fetch(
              `https://rpc1.fivenet.sixprotocol.net/block?height=${
                latestHeight - i
              }`
            ).then((res) => res.json())
          );
        }

        const blocks = await Promise.all(blockPromises);

        // Process validators and their signing history
        const processedValidators = validatorsData.validators
          .filter((v: any) => v.status === "BOND_STATUS_BONDED")
          .map((validator: any) => {
            const consensusPubkey = {
              type: "tendermint/PubKeyEd25519",
              value: validator.consensus_pubkey.key,
            };
            const consensusAddr = consensusPubkeyToHexAddress(consensusPubkey);

            // Get signing history
            const signingHistory = blocks.map((block) => ({
              height: parseInt(block.result.block.header.height),
              signed: block.result.block.last_commit.signatures.some(
                (sig: BlockSignature) => sig.validator_address === consensusAddr
              ),
            }));

            return {
              consensusAddress: consensusAddr,
              operatorAddress: validator.operator_address,
              moniker: validator.description.moniker,
              votingPower: validator.tokens,
              blocks: signingHistory,
            };
          });

        setValidators(processedValidators);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching validator data",
          status: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Set up polling every 6 seconds
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, [toast]);

  const filteredValidators = validators.filter((v: any) =>
    v.moniker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          Validator Uptime
        </Heading>
        <Text color="gray.500">
          Last 50 blocks signing activity for active validators
        </Text>
      </Box>

      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search validators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <UptimeGrid
        validators={filteredValidators}
        isLoading={isLoading}
        maxBlocks={50}
      />
    </Container>
  );
}

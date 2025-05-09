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
import { sha256 } from "@cosmjs/crypto";
import { fromBase64, toHex } from "@cosmjs/encoding";
import axios from "axios";
import ENV from "@/libs/utils/ENV";

// Move types to types/Uptime.ts
interface ValidatorUptime {
  consensusAddress: string;
  operatorAddress: string;
  moniker: string;
  votingPower: string;
  blocks: {
    height: number;
    signed: boolean;
  }[];
}

const consensusPubkeyToHexAddress = (pubkey: {
  type: string;
  value: string;
}) => {
  if (pubkey.type === "tendermint/PubKeyEd25519") {
    const raw = sha256(fromBase64(pubkey.value));
    return toHex(raw).slice(0, 40).toUpperCase();
  }
  throw new Error("Unsupported key type");
};

export default function UptimePage() {
  const [validators, setValidators] = useState<ValidatorUptime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use your API endpoint instead of direct calls
        const response = await fetch("/api/uptime");
        const data = await response.json();

        if (!data.validators?.validators || !data.latestBlockRes) {
          throw new Error("Invalid data received from API");
        }

        const latestHeight = parseInt(data.latestBlockRes.block.header.height);

        // Get last 50 blocks
        const blockPromises = [];
        for (let i = 0; i < 50; i++) {
          if (latestHeight - i <= 0) break;
          blockPromises.push(
            axios
              .get(`${ENV.RPC_URL}/block?height=${latestHeight - i}`)
              .then((res) => res.data)
          );
        }

        const blocks = await Promise.all(blockPromises);

        // Process validators and their signing history
        const processedValidators = data.validators.validators
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
                (sig: { validator_address: string }) =>
                  sig.validator_address === consensusAddr
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
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, [toast]);

  const filteredValidators = validators.filter((v) =>
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

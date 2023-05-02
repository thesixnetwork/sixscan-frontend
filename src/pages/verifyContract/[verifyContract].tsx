// ------------------------- Chakra UI -------------------------
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Flex,
  Text,
  Container,
  Card,
  CardBody,
  Grid,
  GridItem,
  Icon,
  Stack,
  Link,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Badge,
  Image,
  Thead,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Button,
  Select,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Input,
  Tooltip,
  Skeleton,
  Center,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
//---------------------------       ------------------------
import { useEffect, useState } from "react";


const CType = ['[Please Select]', 'Solidity (Single file)', 'Solidity (Multi-Part files)', 'Solidity (Standard-Json-Input)'];
const CVersion = ['[Please Select]', 'v0.8.20-nightly.2023.4.28+commit.0cb27949', 'v0.8.20-nightly.2023.4.27+commit.7c870c95', 'v0.8.20-nightly.2023.4.26+commit.302d46c1',
  'v0.8.20-nightly.2023.4.25+commit.14c25c38', 'v0.8.20-nightly.2023.4.24+commit.4a8d6618', 'v0.8.20-nightly.2023.4.23+commit.cd5ae26e',
  'v0.8.20-nightly.2023.4.21+commit.b75bddbd', 'v0.8.20-nightly.2023.4.20+commit.a297a687', 'v0.8.20-nightly.2023.4.18+commit.a77d4e28', 'v0.8.20-nightly.2023.4.17+commit.02e936ad',
  'v0.8.20-nightly.2023.4.14+commit.e1a9446f', 'v0.8.20-nightly.2023.4.13+commit.5d42bb5e', 'v0.8.20-nightly.2023.4.12+commit.f0c0df2d', 'v0.8.20-nightly.2023.4.11+commit.8b4c1d33',
  'v0.8.20-nightly.2023.4.6+commit.e29a68d3', 'v0.8.20-nightly.2023.4.5+commit.9e0a0af7', 'v0.8.20-nightly.2023.4.4+commit.7b634152', 'v0.8.20-nightly.2023.4.3+commit.0037693c',
  'v0.8.19+commit.7dd6d404'];
const LType = ['[Please Select]', '1) No License (None)', '2) The Unlicense (Unlicense)', '3) MIT License (MIT)', '4) GNU General Public License v2.0 (GNU GPLv2)', '5) GNU General Public License v3.0 (GNU GPLv3)',
  '6) GNU Lesser General Public License v2.1 (GNU LGPLv2.1)', '7) GNU Lesser General Public License v3.0 (GNU LGPLv3)', ' 8) BSD 2-clause "Simplified" license (BSD-2-Clause)', '9) BSD 3-clause "New" Or "Revised" license (BSD-3-Clause)',
  '10) Mozilla Public License 2.0 (MPL-2.0)', '11) Open Software License 3.0 (OSL-3.0)', '12) Apache 2.0 (Apache-2.0)', '13) GNU Affero General Public License (GNU AGPLv3)', '14) Business Source License (BSL 1.1)'];


export default function VerifyContract({
  address,

}: {
  address: string;

}) {
  const [selectedVerify, setSelectedVerify] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Please Select');
  const [isVerify, setIsVerify] = useState({ contract: address || '', compiler_type: '', compiler_version: '', license: '' })

  const handleOptionChange = (event:any) => {
    setIsVerify(event.target.value);
  }
  const handleChange_verify = async (e:any, name:string) => {
    setIsVerify((prev) => ({ ...prev, [name]: e.target.value }));
  }

  const handleReset = () => {
    if (isVerify.contract != '' && isVerify.compiler_type != '' && isVerify.compiler_version != '' && isVerify.license != '') {
      setSelectedVerify(true);
      console.log(selectedVerify)
      console.log(1)
    }
    // reset form or perform other actions
  }

  console.log("isVerify ==>", isVerify)
  console.log("selectedVerify ==>", selectedVerify)

  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      {/* testing eslint */}
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '30px' }}>Verify & Publish Contract Source Code</Text>
          <Text style={{ fontSize: '16px', color: '#8C95A4' }}>COMPILER TYPE AND VERSION SELECTION</Text>
        </Box>
      </Box>

      <Box px={6} pt={4}>
        <Divider />
      </Box>

      {!selectedVerify &&
        (<Box>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ width: '60%', color: '#8C95A4', fontSize: '16px', marginTop: '20px' }}>
              Source code verification provides transparency for users interacting with smart contracts.
              By uploading the source code, escan.live will match the compiled code with that on the blockchain.
              Just like contracts, a &quot;smart contract&quot; should provide end users with more information on what they are
              &ldquo;digitally signing&rdquo; for and give users an opportunity to audit the code to independently verify that it actually
              does what it is supposed to do.
            </Text>

          </Box>

          <Box pt={9} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Text style={{ fontSize: '16px', color: '#1E2022', marginBottom: '10px', width: '50%' }}>Please enter the Contract Address you would like to verify</Text>
              <Input style={{ width: '50%' }} defaultValue={address ? address : ''} onChange={(e) => handleChange_verify(e, "contract")}></Input>
            </Box>

            <Box pt={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Text style={{ fontSize: '16px', color: '#1E2022', marginBottom: '10px', width: '50%' }}>Please select Compiler Type</Text>
              <Box style={{ width: '50%' }}>
                <Select defaultValue={selectedOption} onChange={(e) => handleChange_verify(e, "compiler_type")}>
                  {CType.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box pt={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Text style={{ fontSize: '16px', color: '#1E2022', marginBottom: '10px', width: '50%' }}>Please select Compiler Version</Text>
              <Box style={{ width: '50%' }}>
                <Select defaultValue={selectedOption} onChange={(e) => handleChange_verify(e, "compiler_version")}>
                  {CVersion.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box pt={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Text style={{ fontSize: '16px', color: '#1E2022', marginBottom: '10px', width: '50%' }}>Please select Open Source License Type </Text>
              <Box style={{ width: '50%' }}>
                <Select defaultValue={selectedOption} onChange={(e) => handleChange_verify(e, "license")}>
                  {LType.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box pt={8} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Button onClick={handleReset} style={{ marginRight: '10px', backgroundColor: '#1a90ff' }} >Continue</Button>
              <Button style={{ backgroundColor: 'rgba(119,131,143,.1)', color: '#77838f' }}>Reset</Button>
            </Box>

          </Box>
        </Box>)
      }

      {selectedVerify &&
        (<Box>
          ssss
        </Box>)
      }

    </Flex>
  );
}


export const getServerSideProps = async (context: {
  params: { verifyContract: string };
}) => {
  const { verifyContract } = context.params;
  const address = verifyContract
  return {
    props: address
      ? {
        address,

      }
      : {
        address: null,

      },
  };
};
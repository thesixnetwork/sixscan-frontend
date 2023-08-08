import { NextApiRequest, NextApiResponse } from "next";
import { getTxsFromSchema, getTxsFromSchemaSixNet } from "@/service/txs";
import ENV from "@/utils/ENV";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const schemaCode = req.query.schemaCode as string;
    const isPage = req.query.metadataPage as string;
    const isPageSize = req.query.isPageSize as string;
    try {
        if (ENV.NEXT_PUBLIC_CHAIN_NAME === "sixnet") {
            const SchemaByAddress = await getTxsFromSchemaSixNet(schemaCode, isPage, isPageSize);
            res.status(200).json(SchemaByAddress);
        } else {
            const SchemaByAddress = await getTxsFromSchema(schemaCode, isPage, isPageSize);
            res.status(200).json(SchemaByAddress);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metadata' });
    }
}
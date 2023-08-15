import { NextApiRequest, NextApiResponse } from "next";
import { getAllTransactionByTokenID, getAllActionByTokenID } from "@/service/nftmngr/txs";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const schemaCode = req.query.schemaCode as string;
    const tokenID = req.query.tokenID as string;
    const pageNumber = req.query.page as string;
    const perPage = req.query.limit as string;
    try {
        const SchemaCode = await getAllActionByTokenID(schemaCode,tokenID, pageNumber, perPage);
        res.status(200).json(SchemaCode);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metadata' });
    }
}
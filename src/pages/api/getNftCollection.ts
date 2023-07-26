import { NextApiRequest, NextApiResponse } from "next";
import { getNftCollectionByClient } from "@/service/nftmngr";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const schemaCode = req.query.schemaCode as string;
    const isPage = req.query.isPage as string;
    try {
        const SchemaCode = await getNftCollectionByClient(schemaCode, isPage);
        res.status(200).json(SchemaCode);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metadata' });
    }
}
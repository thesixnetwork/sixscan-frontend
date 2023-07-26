import { NextApiRequest, NextApiResponse } from "next";
import { getSchemaByAddress } from "@/service/nftmngr";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const input = req.query.input as string;
    try {
        const SchemaByAddress = await getSchemaByAddress(input);
        res.status(200).json(SchemaByAddress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metadata' });
    }
}
import { NextApiRequest, NextApiResponse } from "next";
import {
    getBlocksResult,
} from "@/service/block";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const minBlockHeight = req.query.minBlockHeight as string;
    const maxBlockHeight = req.query.maxBlockHeight as string;
    try {
        const minHeight = parseInt(minBlockHeight);
        const maxHeight = parseInt(maxBlockHeight);
        const ActionStat = await getBlocksResult(minHeight, maxHeight);
        res.status(200).json(ActionStat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metadata' });
    }
}
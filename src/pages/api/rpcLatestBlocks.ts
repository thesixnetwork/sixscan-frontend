import { NextApiRequest, NextApiResponse } from "next";
import {
    getLatestBlocks,
} from "@/service/block";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const minBlockHeight = req.query.minBlockHeight as string;
    const maxBlockHeight = req.query.maxBlockHeight as string;
    try {
        const min = parseInt(minBlockHeight);
        const max = parseInt(maxBlockHeight);
        const LatestBlocks = await getLatestBlocks(min, max);
        res.status(200).json(LatestBlocks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metadata' });
    }
}
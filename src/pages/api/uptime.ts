import { NextApiRequest, NextApiResponse } from "next";
import { uptime } from "@/service/staking";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { validators, latestBlock }: any = await uptime();
        res.status(200).json({ validators: validators.data, latestBlock: latestBlock.data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
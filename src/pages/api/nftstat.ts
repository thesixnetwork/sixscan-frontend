import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/utils/ENV";
import { getNFTActionCountStat } from "@/service/nftmngr/stats";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const schemaCode = req.query.schemaCode as string; 
    const endTime = req.query.end_Time as string; 
    const isPage = req.query.isPage as string;
    const isPageSize = req.query.isPageSize as string;
    try {
      const ActionStat = await getNFTActionCountStat(schemaCode,endTime,isPage,isPageSize);
      res.status(200).json(ActionStat);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching metadata' });
    }
  }
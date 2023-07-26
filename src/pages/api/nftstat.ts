import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/utils/ENV";
import { getNFTActionCountStat } from "@/service/nftmngr";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const schemaCode = req.query.schemaCode as string; 
    const isPage = req.query.isPage as string;
    const isPageSize = req.query.isPageSize as string;
    try {
      const ActionStat = await getNFTActionCountStat(schemaCode,isPage,isPageSize);
      res.status(200).json(ActionStat);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching metadata' });
    }
  }
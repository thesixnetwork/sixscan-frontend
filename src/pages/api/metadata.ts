import { NextApiRequest, NextApiResponse } from "next";
import ENV from "@/utils/ENV";
import { getNftCollectionByClient } from "@/service/nftmngr/collection";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const schemaCode = req.query.schemaCode as string; 
    const isPage = req.query.isPage as string;
    try {
      const metadata = await getNftCollectionByClient(schemaCode, isPage);
      res.status(200).json(metadata);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching metadata' });
    }
  }
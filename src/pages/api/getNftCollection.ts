import { NextApiRequest, NextApiResponse } from "next";
import { getNftCollectionByClient } from "@/service/nftmngr/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schemaCode = req.query.schemaCode as string;
  const pageNumber = req.query.metadataPage as string;
  const perPage = req.query.perPage as string;
  try {
    const SchemaCode = await getNftCollectionByClient(
      schemaCode,
      pageNumber,
      perPage
    );
    res.status(200).json(SchemaCode);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}

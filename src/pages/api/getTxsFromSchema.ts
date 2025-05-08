import { NextApiRequest, NextApiResponse } from "next";
import { getTxsFromSchema, getTxsFromSchemaSixNet } from "@/service/txs";
import ENV from "@/libs/utils/ENV";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schemaCode = req.query.schemaCode as string;
  const isPage = req.query.metadataPage as string;
  const isPageSize = req.query.isPageSize as string;
  try {
    const SchemaByAddress = await getTxsFromSchema(
      schemaCode,
      isPage,
      isPageSize
    );
    res.status(200).json(SchemaByAddress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}

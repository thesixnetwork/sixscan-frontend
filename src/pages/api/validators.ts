import { NextApiRequest, NextApiResponse } from "next";
import { getValidators } from "@/service/staking";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const Validators = await getValidators();
    res.status(200).json(Validators);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metadata" });
  }
}

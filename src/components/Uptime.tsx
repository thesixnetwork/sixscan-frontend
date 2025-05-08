import { useEffect, useState } from "react";
import axios from "axios";

export default function Uptime() {
  const [data, setData] = useState<{ validators: any; latestBlock: any } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/uptime");
        console.log(res.data);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching uptime data", error);
      }
    }
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  // Access the specific property of the latestBlock to display
  const blockHeight = data.latestBlock?.block?.header?.height;

  return (
    <div>
      <h2>Uptime for Block #{blockHeight}</h2>

      <h3>Validators</h3>
      <ul>
        {data.validators.validators.map((validator: any) => (
          <li key={validator.operator_address}>
            {validator.description.moniker} ({validator.operator_address})
          </li>
        ))}
      </ul>

      <h3>Signatures</h3>
      <ul>
        {data.validators.validators.map((validator: any) => {
          const signed = data.latestBlock.block?.last_commit?.signatures?.some(
            (signature: any) => signature.validator_address === validator.operator_address
          );
          return (
            <li
              key={validator.operator_address}
              style={{ color: signed ? "green" : "red", fontWeight: "bold" }}
            >
              {validator.description.moniker} ({signed ? "Signed" : "Not Signed"})
            </li>
          );
        })}
      </ul>
    </div>
  );
}
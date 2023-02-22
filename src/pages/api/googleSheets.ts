import { type NextApiRequest, type NextApiResponse } from "next";
import { google } from "googleapis";
import { env } from "../../env/server.mjs";

import { prisma } from "../../server/db/client.js";
import { type Customer } from "@prisma/client";

const googleSheet = async (req: NextApiRequest, res: NextApiResponse) => {
  // const auth = await google.auth.getClient({
  //   keyFilename: env.GOOGLE_APP_CRID,
  //   scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  // });
  // const sheets = google.sheets({ version: "v4", auth });

  // const range = `Sheet1!A2:G758`;

  // const resp = await sheets.spreadsheets.values.get({
  //   spreadsheetId: env.GOOGLE_SHEET_ID,
  //   range,
  // });

  // if (!resp.data.values) {
  //   res.status(200).json(resp.data);
  //   return;
  // }
  // const newCustomers = resp.data.values.map((arr) => {
  //   const customer = {
  //     name: String(arr[1]),
  //     number: arr[6] ? BigInt(arr[6].slice(1, arr[4].length)) : "",
  //     birthDay: String(arr[2]) || null,
  //     idNumber: BigInt(arr[3]) ? BigInt(arr[3]) : null,
  //     mobile: [
  //       BigInt(arr[4] ? arr[4].slice(1, arr[4].length) : false)
  //         ? BigInt(arr[4].slice(1, arr[4].length))
  //         : BigInt(1),
  //       BigInt(arr[5] ? arr[5].slice(1, arr[4].length) : false)
  //         ? BigInt(arr[5].slice(1, arr[4].length))
  //         : BigInt(2),
  //     ],
  //   } as Customer;

  //   return customer;
  // }) as Customer[];
  // try {
  //   const result = await prisma.customer.createMany({
  //     data: newCustomers,
  //     skipDuplicates: true,
  //   });
  //   return res.status(200).json(result);
  // } catch (e) {
  //   console.log(e);
  // }

  return res.status(200).json("");
};

export default googleSheet;

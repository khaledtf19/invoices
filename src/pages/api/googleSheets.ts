import { type NextApiRequest, type NextApiResponse } from "next";
import { google } from "googleapis";
import { env } from "../../env/server.mjs";

import { prisma } from "../../server/db/client";
import { type Customer } from "@prisma/client";

const googleSheet = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = await google.auth.getClient({
    keyFilename: env.GOOGLE_APP_CRID,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const range = `Sheet1!A2:G758`;

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range,
  });

  if (!resp.data.values) {
    res.status(200).json(resp.data);
    return;
  }
  const newCustomers = resp.data.values.map((arr) => {
    const customer = {
      name: String(arr[1]),
      number: String(arr[6]),
      birthday: String(arr[2]),
      idNumber: String(arr[3]),
      mobile: `${String(arr[4])},${String(arr[5])}`,
    } as Customer;

    return customer;
  }) as Customer[];
  try {
    const result = await prisma.customer.createMany({
      data: newCustomers,
      skipDuplicates: true,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
  }

  return res.status(200).json("");
};

export default googleSheet;

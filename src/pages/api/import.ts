import { type NextApiRequest, type NextApiResponse } from "next";
import { db as prisma } from "../../server/db/client";

import customersData from "../../../invoicesBackup/customers.json"
import invoicesData from "../../../invoicesBackup/invoicesData.json"
import bankChangeData from "../../../invoicesBackup/changeBankData.json"
import deptData from "../../../invoicesBackup/deptData.json"

const imp  = async (req:NextApiRequest, res: NextApiResponse)=> {

}

export default imp

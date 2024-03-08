// import { BankName, TransactionTypes } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";

// import calcCards from "../../../invoicesBackup/calcCardsData.json";
// import bankChangeData from "../../../invoicesBackup/changeBankData.json";
// import customersData from "../../../invoicesBackup/customers.json";
// import cusomerCards from "../../../invoicesBackup/customersCardsData.json";
// import deptData from "../../../invoicesBackup/deptData.json";
// import invoicesData from "../../../invoicesBackup/invoicesData.json";
// import { db as prisma } from "../../server/db/client";

const imp = async (req: NextApiRequest, res: NextApiResponse) => {
  // For Customers
  // const customers = await prisma.customer.createMany({data: customersData})

  // For Invoices -->>
  // for (const invoice of invoicesData) {
  //   const customer = await prisma.customer.findUnique({
  //     where: { number: invoice.customer.number },
  //   });
  //   if (!customer) {
  //     continue;
  //   }
  //   await prisma.invoice.create({
  //     data: {
  //       customerId: customer.id,
  //       updatedAt: invoice.createdAt,
  //       createdAt: invoice.createdAt,
  //       cost: invoice.cost,
  //       userId: "clthxdqku0000hq48z2dbc5ik",
  //       bankChange: {
  //         createMany: {
  //           data: invoice.bankChange.map((b) => ({
  //             userId: "clthxdqku0000hq48z2dbc5ik",
  //             ...b,
  //             type:
  //               b.type === "Add" ? TransactionTypes.Add : TransactionTypes.Take,
  //             bankName: b.bankName === "Bss" ? BankName.Bss : BankName.Khadmaty,
  //           })),
  //         },
  //       },
  //       transaction: { create: { userId: "clthxdqku0000hq48z2dbc5ik" } },
  //     },
  //   });
  // }

  // For BankChanges -->>
  // await prisma.bankChange.createMany({
  //   data: bankChangeData.map((b) => ({
  //     ...b,
  //     userId: "clthxdqku0000hq48z2dbc5ik",
  //     type: b.type === "Add" ? TransactionTypes.Add : TransactionTypes.Take,
  //     bankName: b.bankName === "Bss" ? BankName.Bss : BankName.Khadmaty,
  //   })),
  // });

  // For Customer Debt -->>
  // for (const dept of deptData) {
  //   const customer = await prisma.customer.findUnique({
  //     where: { number: dept.customer.number },
  //   });
  //   await prisma.customerDebt.createMany({
  //     data: {
  //       amount: dept.amount,
  //       type:
  //         dept.type === "Add" ? TransactionTypes.Add : TransactionTypes.Take,
  //       createdAt: dept.createdAt,
  //       updatedAt: dept.updatedAt,
  //       deleted: dept.deleted,
  //       isImportant: dept.isImportant,
  //       customerId: customer?.id,
  //       userId: "clthxdqku0000hq48z2dbc5ik",
  //     },
  //   });
  // }

  // For Calc Cards
  // await prisma.calculateCards.createMany({
  //   data: calcCards
  // })

  // For Customer Note/Card
  // for (const card of cusomerCards) {
  //   if (!card.customer) {
  //     await prisma.customerNote.create({
  //       data: {
  //         global: card.global,
  //         userId: "clthxdqku0000hq48z2dbc5ik",
  //         noteContent: card.noteContent,
  //       },
  //     });
  //     continue;
  //   }
  //   const customer = await prisma.customer.findUnique({
  //     where: { number: card.customer?.number },
  //   });

  //   await prisma.customerNote.create({
  //     data: {
  //       customerId: customer?.id,
  //       global: card.global,
  //       userId: "clthxdqku0000hq48z2dbc5ik",
  //       noteContent: card.noteContent,
  //     },
  //   });
  // }

  // await prisma.bank.create({
  //   data: {
  //     bss: -282.95,
  //     khadmaty: 5254.96,
  //   }
  // })

  return res.status(200).json("OK :)");
};

export default imp;

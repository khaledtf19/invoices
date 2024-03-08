import { adminProcedure, router } from "../trpc";

export const exportRouter = router({
  getAllCustomers: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.customer.findMany({
      select: {
        name: true,
        number: true,
        mobile: true,
        address: true,
        idNumber: true,
        birthday: true,
      },
    });
  }),

  getlatestInvoices: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.invoice.findMany({
      // change this ->> to 200
      take: 500,
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        cost: true,
        bankChange: {
          select: {
            createdAt: true,
            amount: true,
            type: true,
            after: true,
            before: true,
            bankName: true,
          },
        },
        customer: { select: { number: true, name: true } },
      },
    });
  }),

  getAllChangeBank: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.bankChange.findMany({
      where: { invoiceId: null },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        before: true,
        after: true,
        amount: true,
        bankName: true,
        createdAt: true,
        type: true,
      },
    });
  }),

  getAllDept: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.customerDebt.findMany({
      select: {
        createdAt: true,
        amount: true,
        type: true,
        deleted: true,
        isImportant: true,
        updatedAt: true,
        note: true,
        customer: { select: { number: true } },
      },
    });
  }),

  getAllCustomersCards: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.customerNote.findMany({
      select: {
        global: true,
        noteContent: true,
        customer: { select: { number: true } },
      },
    });
  }),

  getAllCalcCards: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.calculateCards.findMany({
      select: { cost: true, values: true },
    });
  }),
});

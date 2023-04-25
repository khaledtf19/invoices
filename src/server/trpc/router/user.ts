import {
  TransactionsArr,
  ZBankType,
  ZTransactions,
} from "../../../types/utils.types";
import { router, adminProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({ orderBy: { name: "asc" } });
  }),

  getUserById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          invoices: true,
          transactions: {
            take: 50,
            include: {
              invoice: {
                select: { cost: true, id: true, createdAt: true },
              },
              user: { select: { name: true, email: true } },
            },
          },
          changeBalanceForUser: {
            include: {
              admin: { select: { name: true, email: true } },
              user: { select: { name: true, email: true } },
            },
            take: 20,
          },
          changeBalanceFromAdmin: {
            include: {
              admin: { select: { name: true, email: true } },
              user: { select: { name: true, email: true } },
            },
            take: 20,
          },
        },
      });
    }),

  changeUserBalance: adminProcedure
    .input(
      z.object({
        userId: z.string().min(5),
        amount: z.number().min(5),
        type: ZTransactions,
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.type === TransactionsArr[0]) {
        await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { userBalance: { increment: input.amount } },
        });
      } else if (input.type === TransactionsArr[1]) {
        await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { userBalance: { decrement: input.amount } },
        });
      }

      await ctx.prisma.changeBalance.create({
        data: {
          adminId: ctx.session.user.id,
          userId: input.userId,
          type: input.type,
          amount: input.amount,
        },
      });

      return { message: "Done" };
    }),

  createNewBank: adminProcedure.mutation(async ({ ctx }) => {
    const count = await ctx.prisma.bank.count();
    if (count > 0) return { message: "bank already exists" };
    await ctx.prisma.bank.create({ data: { bss: 0, khadmaty: 0 } });
    return { message: "done" };
  }),

  getBank: adminProcedure.query(async ({ ctx }) => {
    const bank = await ctx.prisma.bank.findFirst();
    return bank;
  }),

  getBankChange: adminProcedure.query(async ({ ctx }) => {
    const bankChanges = await ctx.prisma.bankChange.findMany({
      include: {
        user: true,
        invoice: { select: { customer: { select: { name: true } }, id: true } },
      },
    });
    return bankChanges;
  }),

  changeBank: adminProcedure
    .input(
      z.object({
        bankName: ZBankType,
        amount: z.number(),
        transactionType: ZTransactions,
        invoiceId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.transactionType === TransactionsArr[0]) {
        await ctx.prisma.bank.updateMany({
          data: {
            [input.bankName.toLocaleLowerCase()]: { increment: input.amount },
          },
        });
      } else if (input.transactionType === TransactionsArr[1]) {
        await ctx.prisma.bank.updateMany({
          data: {
            [input.bankName.toLocaleLowerCase()]: { decrement: input.amount },
          },
        });
      }
      await ctx.prisma.bankChange.create({
        data: {
          type: input.transactionType,
          amount: input.amount,
          bankName: input.bankName,
          userId: ctx.session.user.id,
          invoiceId: input.invoiceId,
        },
      });
      return { message: "done" };
    }),
});

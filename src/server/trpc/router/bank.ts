import {
  TransactionsArr,
  ZBankType,
  ZTransactions,
} from "../../../types/utils.types";
import { router, adminProcedure } from "../trpc";
import { z } from "zod";


export const bankRouter = router({
  createNewBank: adminProcedure.mutation(async ({ ctx }) => {
    const count = await ctx.prisma.bank.count();
    if (count > 0) return { message: "bank already exists" };
    await ctx.prisma.bank.create({ data: { bss: 0, khadmaty: 0 } });
    return { message: "done" };
  }),

  getBank: adminProcedure.query(async ({ ctx }) => {
    const bank = await ctx.prisma.bank.findFirst();

    if (bank) {
      bank.bss = parseFloat(bank.bss.toFixed(2))
      bank.khadmaty = parseFloat(bank.khadmaty.toFixed(2))
    }
    return bank;
  }),

  getBankdataAtaDate: adminProcedure.input(z.object({ dateMin: z.string().optional(), dateMax: z.string().optional() })).mutation(async ({ input, ctx }) => {

    const bankChanges = await ctx.prisma.bankChange.count({
      where: {
        createdAt: {
          gte: input.dateMin,
          lte: input.dateMax,
        },
      },
    })

    return bankChanges
  }),

  getBankChange: adminProcedure.query(async ({ ctx }) => {
    const bankChanges = await ctx.prisma.bankChange.findMany({
      include: {
        user: true,
        invoice: { select: { customer: { select: { name: true } }, id: true } },
      },
      orderBy: {
        createdAt: "desc",
      }
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

  undoBankChange: adminProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ input, ctx }) => {
    const bankChange = await ctx.prisma.bankChange.findUnique({
      where: { id: input.id },
    });
    if (bankChange?.type === TransactionsArr[0]) {
      await ctx.prisma.bank.updateMany({
        data: {
          [bankChange.bankName.toLocaleLowerCase()]: { decrement: bankChange?.amount },
        },
      });
    } else if (bankChange?.type === TransactionsArr[1]) {
      await ctx.prisma.bank.updateMany({
        data: {
          [bankChange.bankName.toLocaleLowerCase()]: { increment: bankChange?.amount },
        },
      });
    }

    await ctx.prisma.bankChange.delete({
      where: { id: bankChange?.id },
    })
    return { message: "done" };
  })

})

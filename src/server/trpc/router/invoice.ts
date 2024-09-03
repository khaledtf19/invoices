import type { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { InvoiceStatusArr, UserRoleArr } from "../../../types/utils.types";
import { CardsArr } from "../../../utils/utils";
import { protectedProcedure, router } from "../trpc";

export const invoiceRouter = router({
  makeInvoice: protectedProcedure
    .input(z.object({ cost: z.number(), customerId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id: UserId } = ctx.session.user;

      const invoice = await ctx.prisma.invoice.create({
        data: {
          userId: UserId,
          customerId: input.customerId,
          cost: input.cost,
        },
      });
      await ctx.prisma.invoiceStatus.create({
        data: { invoiceId: invoice.id },
      });
      await ctx.prisma.transaction.create({
        data: {
          userId: ctx.session.user.id,
          invoiceId: invoice.id,
        },
      });

      if (ctx.session.user.role !== UserRole.Admin) {
        if (ctx.session.user.userBalance >= input.cost) {
          await ctx.prisma.user.update({
            where: { id: UserId },
            data: { userBalance: { decrement: input.cost } },
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Need more User Balance to do this request",
          });
        }
      }

      return invoice;
    }),

  getInvoiceById: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.findUnique({
        where: { id: input.invoiceId },
        include: {
          invoiceNotes: true,
          invoiceStatus: true,
          customer: {
            include: { customerDebt: { where: { deleted: false } } },
          },
          madeBy: true,
          transaction: true,
          bankChange: true,
        },
      });
      if (!invoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "couldn't find this Invoice",
        });
      }

      if (
        invoice.transaction?.viewed === false &&
        ctx.session.user.role === UserRole.Admin
      ) {
        await ctx.prisma.transaction.update({
          where: { invoiceId: invoice.id },
          data: { viewed: true },
        });
      }
      return invoice;
    }),

  updateInvoiceStatus: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        invoiceStatus: z.enum(InvoiceStatusArr).optional(),
        invoiceStatusNote: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== UserRoleArr[1]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must be an Admin for this request",
        });
      }

      return await ctx.prisma.invoiceStatus.update({
        where: { invoiceId: input.invoiceId },
        data: {
          status: input.invoiceStatus,
          note: input.invoiceStatusNote,
          invoice: { update: { updatedAt: new Date() } },
        },
      });
    }),

  deleteInvoice: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.findUnique({
        where: { id: input.invoiceId },
        include: { madeBy: true },
      });

      if (!invoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "couldn't find this Invoice",
        });
      }

      if (
        invoice?.madeBy.id !== ctx.session.user.id &&
        ctx.session.user.role !== UserRoleArr[1]
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Must be an Admin for or you are the owner of this invoice to do this request",
        });
      }
      await ctx.prisma.invoice.delete({ where: { id: invoice.id } });
      return { message: `this invoice has been deleted` };
    }),

  getNewInvoices: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role === UserRole.Admin) {
      return await ctx.prisma.invoice.findMany({
        include: { invoiceStatus: true, customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return ctx.prisma.invoice.findMany({
      where: { userId: ctx.session.user.id },
      include: { invoiceStatus: true, customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),

  getAllCalc: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.calculateCards.findMany({ orderBy: { cost: "asc" } });
  }),

  getCalcById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.prisma.calculateCards.findUnique({
        where: { id: input.id },
      });
      if (!res) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "this could not find this calc",
        });
      }
      return res;
    }),

  getCardsPrices: protectedProcedure.query(async ({ ctx }) => {
    let cards = await ctx.prisma.cards.findMany({
      orderBy: { value: "asc" },
    });
    if (cards.length === 0) {
      await ctx.prisma.cards.createMany({
        data: CardsArr.map((v) => ({ value: v })),
      });

      cards = await ctx.prisma.cards.findMany();
    }
    return cards;
  }),

  addNewCalcCards: protectedProcedure
    .input(
      z.object({
        cost: z.number().min(5),
        cardsValues: z.number().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const oldCalc = await ctx.prisma.calculateCards.findUnique({
        where: { cost: input.cost },
      });
      if (oldCalc) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "this card already exist",
        });
      }

      const newCalc = await ctx.prisma.calculateCards.create({
        data: {
          cost: input.cost,
          values: input.cardsValues as Prisma.JsonArray,
        },
      });

      return newCalc;
    }),

  updateCalcCards: protectedProcedure
    .input(
      z.object({
        id: z.string().min(3),
        newCost: z.number().min(1),
        cardsValues: z.number().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const calc = await ctx.prisma.calculateCards.update({
        where: { id: input.id },
        data: {
          cost: input.newCost,
          values: input.cardsValues as Prisma.JsonArray,
        },
      });
      return calc;
    }),

  deleteCalcCard: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.calculateCards.delete({ where: { id: input.id } });

      return { message: "deleted succesfully" };
    }),
  getCalcCardsForInvoice: protectedProcedure
    .input(z.object({ bankChangeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const bankCost = await ctx.prisma.bankChange.findUnique({
        where: { id: input.bankChangeId },
      });
      return await ctx.prisma.calculateCards.findFirst({
        where: { cost: { gte: bankCost?.amount } },
        orderBy: { cost: "asc" }
      });
    }),
});

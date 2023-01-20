import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { UserRoleArr, InvoiceStatusArr } from "../../../types/utils.types";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@prisma/client";

export const invoiceRouter = router({
  getAllInvoices: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.invoice.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }),

  makeInvoice: protectedProcedure
    .input(z.object({ cost: z.number(), customerId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = ctx.session.user;

      const invoice = await ctx.prisma.invoice.create({
        data: { userId: id, customerId: input.customerId, cost: input.cost },
      });
      await ctx.prisma.invoiceStatus.create({
        data: { invoiceId: invoice.id },
      });
      return invoice;
    }),

  getInvoiceById: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.invoice.findUnique({
        where: { id: input.invoiceId },
        include: {
          invoiceNotes: true,
          invoiceStatus: true,
          customer: true,
          madeBy: true,
        },
      });
    }),

  updateInvoiceStatus: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        invoiceStatus: z.enum(InvoiceStatusArr).optional(),
        invoiceStatusNote: z.string().nullish(),
      })
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
        include: { invoiceStatus: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return ctx.prisma.invoice.findMany({
      where: { userId: ctx.session.user.id },
      include: { invoiceStatus: true },
      orderBy: { createdAt: "desc" },
    });
  }),
});

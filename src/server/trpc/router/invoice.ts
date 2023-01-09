import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

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
      return await ctx.prisma.invoice.create({
        data: { userId: id, customerId: input.customerId, cost: input.cost },
      });
    }),
});

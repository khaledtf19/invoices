import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

const CustomerValidation = z.object({
  name: z.string().max(225).min(3),
  number: z.bigint(),
  idNumber: z.bigint().nullish(),
  mobile: z.bigint().array().max(5),
});

export const customerRouter = router({
  search: publicProcedure
    .input(
      z.object({
        number: z.bigint().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.findMany({
        where: {
          OR: [
            { number: Number(input.number) || undefined },
            {
              name: {
                contains: input.name ? input.name : undefined,
                mode: "insensitive",
              },
            },
          ],
        },
      });
    }),

  createCustomer: protectedProcedure
    .input(CustomerValidation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.create({ data: input });
    }),

  getCustomerById: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.customer.findUnique({
        where: { id: input.customerId },
        include: {
          invoices: { include: { invoiceStatus: true } },
          customerNotes: true,
        },
      });
    }),

  updateCustomer: protectedProcedure
    .input(CustomerValidation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.update({
        where: { number: input.number },
        data: input,
      });
    }),
});

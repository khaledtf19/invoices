import { z } from "zod";

import { router, protectedProcedure, adminProcedure } from "../trpc";

const CustomerValidation = z.object({
  name: z.string().max(225).min(3),
  number: z.bigint().refine((ph: bigint) => ph.toString().length > 8, {
    message: "must be > 8",
  }),
  birthday: z.string().optional().nullable(),
  idNumber: z
    .bigint()
    .refine((idNum: bigint) => idNum.toString().length > 8, {
      message: "must be > 8",
    })
    .nullish(),
  mobile: z.bigint().array().max(5),
});

export const customerRouter = router({
  search: protectedProcedure
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
          invoices: { include: { invoiceStatus: true }, take: 10 },
          customerNotes: true,
          customerDebt: true,
        },
      });
    }),

  updateCustomer: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().max(225).min(3),
        number: z.bigint().refine((ph: bigint) => ph.toString().length > 8, {
          message: "must be > 8",
        }),
        birthday: z.string().optional().nullable(),
        idNumber: z
          .bigint()
          .refine((ph: bigint) => ph.toString().length > 8, {
            message: "must be > 8",
          })
          .nullish(),
        mobile: z
          .bigint()
          .refine((ph: bigint) => ph.toString().length > 8, {
            message: "must be > 8",
          })
          .array()
          .max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.update({
        where: { id: input.id },
        data: input,
      });
    }),

  createDebt: protectedProcedure
    .input(z.object({ customerId: z.string().min(3), amount: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerDebt.create({
        data: { customerId: input.customerId, amount: input.amount },
      });

      return { message: "done" };
    }),
  deleteDebt: protectedProcedure
    .input(z.object({ debtId: z.string().min(3) }))
    .mutation(async () => {
      return;
    }),
});

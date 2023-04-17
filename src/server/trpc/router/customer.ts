import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure, adminProcedure } from "../trpc";

const CustomerValidation = z.object({
  name: z.string().max(225).min(3),
  number: z.string().min(8).max(20),
  birthday: z.string().optional().nullable(),
  idNumber: z.string().max(30).nullish(),
  mobile: z.string().array().max(5),
});

export const customerRouter = router({
  search: protectedProcedure
    .input(
      z.object({
        number: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.number?.at(0) === "0") {
        input.number === input.number.slice(1, input.number.length);
      }

      return await ctx.prisma.customer.findMany({
        where: {
          OR: [
            {
              number: {
                contains: input.number || undefined,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: input.name || undefined,
                mode: "insensitive",
              },
            },
          ],
        },
        select: { name: true, number: true, id: true },
      });
    }),

  createCustomer: protectedProcedure
    .input(CustomerValidation)
    .mutation(async ({ input, ctx }) => {
      if (input.number?.at(0) === "0") {
        input.number === input.number.slice(1, input.number.length);
      }
      return await ctx.prisma.customer.create({ data: input });
    }),

  getCustomerById: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.customer.findUnique({
        where: { id: input.customerId },
        include: {
          invoices: {
            include: {
              invoiceStatus: true,
              customer: { select: { name: true } },
            },
            take: 10,
            orderBy: { createdAt: "desc" },
          },
          customerNotes: true,
          customerDebt: { where: { deleted: false } },
        },
      });
    }),

  getCustomersNotes: protectedProcedure.input(z.object({
    customerId: z.string().min(5)
  })).query(async ({ input, ctx }) => {
    return await ctx.prisma.customerNote.findMany({ where: { customerId: input.customerId } })
  }),

  updateCustomer: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().max(225).min(3),
        number: z.string().min(8),
        address: z.string().min(2).optional().nullable(),
        birthday: z.string().optional().nullable(),
        idNumber: z.string().optional().nullish(),
        mobile: z.string().min(8).array().max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.update({
        where: { id: input.id },
        data: input,
      });
    }),

  createCustomerNote: protectedProcedure.input(z.object({ text: z.string().min(3), customerId: z.string().min(5) })).mutation(
    async ({ input, ctx }) => {
      const count = await ctx.prisma.customerNote.count({ where: { customerId: input.customerId } })

      if (count >= 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Customer have max Note",
        });
      }

      await ctx.prisma.customerNote.create({ data: { noteContent: input.text, customerId: input.customerId, userId: ctx.session.user.id } })

      return { message: "done" }
    }
  )
  ,
  updateCusomerNote: protectedProcedure.input(z.object({ newText: z.string().min(3), noteId: z.string().min(5) })).mutation(async ({ input, ctx }) => {
    const note = await ctx.prisma.customerNote.update({ where: { id: input.noteId }, data: { noteContent: input.newText } })
    return note
  }),
  createDebt: protectedProcedure
    .input(z.object({ customerId: z.string().min(3), amount: z.number(), type: z.enum(["Add", "Take"]) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerDebt.create({
        data: { customerId: input.customerId, amount: input.amount, type: input.type },
      });

      return { message: "done" };
    }),

  deleteDebt: protectedProcedure
    .input(z.object({ debtId: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerDebt.update({ where: { id: input.debtId }, data: { deleted: true, userId: ctx.session.user.id } })

      return { message: "done" };
    }),

  getAllDebt: adminProcedure.input(z.object({ customerId: z.string().optional() })).query(async ({ ctx, input }) => {
    if (input.customerId) {
      return await ctx.prisma.customerDebt.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: "desc" },
        include: { Customer: { select: { name: true, number: true } } },

      })
    }

    return await ctx.prisma.customerDebt.findMany({
      orderBy: { createdAt: "desc" },
      include: { Customer: { select: { name: true, number: true } } },
    });
  }),

});

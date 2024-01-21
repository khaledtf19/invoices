import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, protectedProcedure, router } from "../trpc";

const CustomerValidation = z.object({
  name: z.string().max(225).min(3),
  number: z.string().min(8).max(20),
  birthday: z.string().optional().nullable(),
  idNumber: z.string().max(30).nullish(),
  address: z.string().optional().nullable(),
  mobile: z.string().array().max(5),
});

export const customerRouter = router({
  search: protectedProcedure
    .input(
      z.object({
        number: z.string().optional(),
        name: z.string().optional(),
      }),
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
              },
            },
            {
              name: {
                contains: input.name || undefined,
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
      return await ctx.prisma.customer.create({
        data: { ...input, mobile: input.mobile[0] },
      });
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
          customerDebt: { where: { deleted: false } },
        },
      });
    }),

  getCustomersNotes: protectedProcedure
    .input(
      z.object({
        customerId: z.string().min(5),
      }),
    )
    .query(async ({ input, ctx }) => {
      let globalNote = await ctx.prisma.customerNote.findMany({
        where: { global: true },
      });

      if (globalNote.length != 2) {
         await ctx.prisma.customerNote.create({
          data: { noteContent: "", global: true, userId: ctx.session.user.id },
        });
      }

      const result = await ctx.prisma.customerNote.findMany({
        where: { customerId: input.customerId },
      });
      result.unshift(...globalNote);
      return result;
    }),

  updateCustomer: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().max(225).min(3),
        number: z.string().min(8),
        address: z.string().optional().nullable(),
        birthday: z.string().optional().nullable(),
        idNumber: z.string().optional().nullish(),
        mobile: z.string().min(8).array().max(5),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const mobileString = input.mobile.join(",");
      return await ctx.prisma.customer.update({
        where: { id: input.id },
        data: { ...input, mobile: mobileString },
      });
    }),

  createCustomerNote: protectedProcedure
    .input(z.object({ text: z.string().min(3), customerId: z.string().min(5) }))
    .mutation(async ({ input, ctx }) => {
      const count = await ctx.prisma.customerNote.count({
        where: { customerId: input.customerId },
      });

      if (count >= 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Customer have max Note",
        });
      }

      await ctx.prisma.customerNote.create({
        data: {
          noteContent: input.text,
          customerId: input.customerId,
          userId: ctx.session.user.id,
        },
      });

      return { message: "done" };
    }),
  updateCustomerNote: protectedProcedure
    .input(z.object({ newText: z.string().min(3), noteId: z.string().min(5) }))
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.prisma.customerNote.update({
        where: { id: input.noteId },
        data: { noteContent: input.newText },
      });
      return note;
    }),
  createDebt: protectedProcedure
    .input(
      z.object({
        customerId: z.string().min(3),
        amount: z.number(),
        type: z.enum(["Add", "Take"]),
        isImportant: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerDebt.create({
        data: {
          customerId: input.customerId,
          amount: input.amount,
          type: input.type,
          isImportant: input.isImportant,
        },
      });

      return { message: "done" };
    }),

  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.string().min(5) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerNote.delete({ where: { id: input.noteId } });
      return { message: "done" };
    }),

  deleteDebt: protectedProcedure
    .input(z.object({ debtId: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerDebt.update({
        where: { id: input.debtId },
        data: { deleted: true, userId: ctx.session.user.id },
      });

      return { message: "done" };
    }),

  getAllDebt: adminProcedure
    .input(z.object({ customerId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.customerId) {
        return await ctx.prisma.customerDebt.findMany({
          where: { customerId: input.customerId },
          orderBy: { createdAt: "desc" },
          include: {
            customer: { select: { name: true, number: true, address: true } },
          },
        });
      }

      return await ctx.prisma.customerDebt.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true, number: true, address: true } },
        },
      });
    }),
  updateDebtNote: protectedProcedure
    .input(z.object({ text: z.string(), debtId: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerDebt.update({
        where: { id: input.debtId },
        data: { note: input.text },
      });

      return { message: "done" };
    }),

  updateDebtIsImportant: adminProcedure
    .input(
      z.object({
        debtId: z.string().min(3),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const debt = await ctx.prisma.customerDebt.findUnique({
        where: { id: input.debtId },
      });
      await ctx.prisma.customerDebt.update({
        where: { id: input.debtId },
        data: { isImportant: !debt?.isImportant },
      });
      return { message: "done" };
    }),
});

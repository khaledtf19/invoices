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
            include: {
              invoice: { select: { cost: true, id: true, createdAt: true } },
              user: { select: { name: true, email: true } },
            },
          },
        },
      });
    }),

  addUserBalance: adminProcedure
    .input(z.object({ id: z.string().min(5), newBalance: z.number().min(5) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: { userBalance: { increment: input.newBalance } },
      });
      return { message: "Done" };
    }),
});

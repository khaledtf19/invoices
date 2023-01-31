import { router, adminProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getUserById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({ where: { id: input.id } });
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

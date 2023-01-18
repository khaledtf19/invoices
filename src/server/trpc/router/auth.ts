import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";
import { UserRoleArr } from "../../../types/utils.types";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  makeAdmin: protectedProcedure
    .input(z.object({ adminPassword: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.adminPassword !== env.ADMIN_PASSWORD) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bad Admin Password",
        });
      }
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { role: UserRoleArr[1] },
      });
      return { message: "You are now an Admin " };
    }),
});

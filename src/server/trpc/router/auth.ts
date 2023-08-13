import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "../../../env/server.mjs";
import { UserRoleArr } from "../../../types/utils.types";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user;
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

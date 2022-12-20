import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const customerRoute = router({
  search: publicProcedure
    .input(
      z.object({
        number: z.number().nullish(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.findMany({
        where: {
          OR: [
            { number: input.number },
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
    .input(
      z.object({
        name: z.string(),
        number: z.number(),
        idNumber: z.number().nullish(),
        mobile: z.number().array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.customer.create({ data: input });
    }),
});

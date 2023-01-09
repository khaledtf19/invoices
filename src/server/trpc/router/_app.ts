import { router } from "../trpc";
import { authRouter } from "./auth";
import { customerRouter } from "./customer";
import { exampleRouter } from "./example";
import { invoiceRouter } from "./invoice";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  customer: customerRouter,
  invoice: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

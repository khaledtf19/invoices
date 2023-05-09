import { router } from "../trpc";
import { authRouter } from "./auth";
import { bankRouter } from "./bank";
import { customerRouter } from "./customer";
import { invoiceRouter } from "./invoice";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  customer: customerRouter,
  invoice: invoiceRouter,
  user: userRouter,
  bank: bankRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

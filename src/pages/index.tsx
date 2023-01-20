import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import { InvoicesTable } from "../components/tables";
import { LoadingAnimation } from "../components/utils";

const Home: NextPage = () => {
  const { data: invoicesData, isLoading } =
    trpc.invoice.getNewInvoices.useQuery();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!invoicesData) {
    return <h1>Can not show that</h1>;
  }

  return <InvoicesTable invoices={invoicesData} />;
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl ">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-indigo-900 px-10 py-3 font-semibold text-white no-underline transition hover:bg-indigo-700"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };

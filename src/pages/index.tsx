import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import LoadingTable from "../components/tables/LoadingTable";
import InvoicesTable from "../components/tables/InvoicesTable";

const Home: NextPage = () => {
  const { data: invoicesData, isLoading } =
    trpc.invoice.getNewInvoices.useQuery();

  if (isLoading) {
    return <LoadingTable type="big" />;
  }

  if (!invoicesData) {
    return <h1>Can not show that</h1>;
  }

  return (
    <div className=" flex w-full flex-col items-center gap-5">
      <h1 className=" text-4xl font-bold">Invoices</h1>
      <InvoicesTable invoices={invoicesData} />
    </div>
  );
};

export default Home;

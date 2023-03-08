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

  return <InvoicesTable invoices={invoicesData} />;
};

export default Home;

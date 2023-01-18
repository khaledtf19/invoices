import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { SyncLoader } from "react-spinners";

import InvoiceView from "../../components/InvoiceView";

const InvoiceById = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: invoiceData,
    isFetching,
    refetch,
  } = trpc.invoice.getInvoiceById.useQuery(
    {
      invoiceId: String(id),
    },
    { refetchOnWindowFocus: false }
  );

  if (isFetching) {
    return <SyncLoader color="#312e81" />;
  }

  if (!invoiceData) {
    return <div>Could not find invoice by this ID</div>;
  }

  return (
    <InvoiceView
      invoiceData={invoiceData}
      refetch={() => {
        refetch();
      }}
    />
  );
};

export default InvoiceById;

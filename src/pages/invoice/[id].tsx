import { useRouter } from "next/router";

import InvoiceView from "../../components/InvoiceView";
import { LoadingInvoice } from "../../components/utils";
import { trpc } from "../../utils/trpc";

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
    { refetchOnWindowFocus: false },
  );

  if (isFetching) {
    return <LoadingInvoice />;
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

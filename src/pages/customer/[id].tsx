import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { SyncLoader } from "react-spinners";
import CustomerView from "../../components/CustomerView";
import { InvoicesTable } from "../../components/tables";
import { LoadingCustomer } from "../../components/utils";

const Customer = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: customerData,
    isLoading,
    refetch,
    isRefetching,
  } = trpc.customer.getCustomerById.useQuery(
    {
      customerId: String(id),
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isRefetching) {
    return <LoadingCustomer />;
  }

  if (!customerData) {
    return <h1>Can not Find this customer</h1>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 pb-5">
      <CustomerView
        customerData={customerData}
        refetch={() => {
          refetch();
        }}
      />

      {customerData.invoices.length === 0 ? (
        <h1>No Invoices</h1>
      ) : (
        <InvoicesTable invoices={customerData.invoices} />
      )}
    </div>
  );
};

export default Customer;

import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import CustomerView from "../../components/CustomerView";
import { LoadingCustomer } from "../../components/utils";
import InvoicesTable from "../../components/tables/InvoicesTable";

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

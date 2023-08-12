import { useRouter } from "next/router";

import CustomerView from "../../components/customer";
import CardsTab from "../../components/customer/CardsTab";
import LoadingCustomer from "../../components/customer/LoadingCustomer";
import InvoicesTable from "../../components/tables/InvoicesTable";
import { PageTabs } from "../../components/utils";
import { trpc } from "../../utils/trpc";

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
    { refetchOnWindowFocus: false },
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

      <PageTabs
        tabs={[
          {
            tabName: "Invoices",
            component:
              customerData.invoices.length === 0 ? (
                <h1>No Invoices</h1>
              ) : (
                <InvoicesTable invoices={customerData.invoices} />
              ),
          },
          {
            tabName: "Cards",
            component: <CardsTab customerData={customerData} />,
          },
        ]}
      />
    </div>
  );
};

export default Customer;

import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { SyncLoader } from "react-spinners";
import CustomerView from "../../components/CustomerView";

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
      userId: String(id),
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isRefetching) {
    return <SyncLoader color="#312e81" />;
  }

  return (
    <CustomerView
      customerData={customerData}
      refetch={() => {
        refetch();
      }}
    />
  );
};

export default Customer;

import { trpc } from "../../utils/trpc";
import DebtTable from "../tables/DebtTable";
import LoadingTable from "../tables/LoadingTable";

const CustomerDebtModal: React.FC<{ cusomerId?: string }> = ({ cusomerId }) => {
  const { data: debtData, isLoading } = trpc.customer.getAllDebt.useQuery({ customerId: cusomerId });

  if (isLoading) {
    return <LoadingTable type="big" />;
  }
  if (!debtData) {
    return <></>;
  }

  return (
    <div className=" h-full w-full">
      <DebtTable data={debtData} />
    </div>
  );
};

export default CustomerDebtModal;

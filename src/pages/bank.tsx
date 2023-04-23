import { trpc } from "../utils/trpc";

const bank = () => {
  const { data: bankData } = trpc.user.getBank.useQuery();
  const { data: bankChangeData } = trpc.user.getBankChange.useQuery();

  return <div>bank</div>;
};

export default bank;

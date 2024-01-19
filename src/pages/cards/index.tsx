import { useEffect} from "react";

import CardsTable from "../../components/tables/CardsTable";
import LoadingTable from "../../components/tables/LoadingTable";
import { PrimaryButton} from "../../components/utils";
import { useModalState } from "../../hooks/modalState";
import { trpc } from "../../utils/trpc";
import { AddOrUpdateCardsModal } from "../../components/cards";

export default function CardsPage() {
  const { data, isLoading, isRefetching } = trpc.invoice.getAllCalc.useQuery();
  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  useEffect(() => {
    return closeModal();
  }, [closeModal]);



  if (isLoading || isRefetching) {
    return <LoadingTable type="small" />;
  }

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div className="flex w-full  flex-col items-center justify-start gap-3">
      <div className="w-1/12">
        <PrimaryButton
          onClick={() => {
            openModal({ newComponents: <AddOrUpdateCardsModal /> });
          }}
          label="Add"
        />
      </div>
      <CardsTable cards={data} />
    </div>
  );
}


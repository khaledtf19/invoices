import { useEffect, useState } from "react";

import { useModalState } from "../hooks/modalState";
import { trpc } from "../utils/trpc";
import { Input, LoadingAnimation, PrimaryButton, RedButton } from "./utils";

export function AddOrUpdateCardsModal({ id }: { id?: string }) {
  const [currCost, setCost] = useState("");
  const [currCards, setCards] = useState<number[]>([]);

  const { closeModal, changeComponent } = useModalState((state) => ({
    closeModal: state.closeModal,
    changeComponent: state.changeComponent,
  }));

  const { data: prices, isLoading } = trpc.invoice.getCardsPrices.useQuery();
  const updateCalcById = trpc.invoice.updateCalcCards.useMutation({
    onSuccess: () => {
      closeModal();
      context.invoice.getAllCalc.invalidate();
    },
  });
  const addNewCalc = trpc.invoice.addNewCalcCards.useMutation({
    onSuccess: () => {
      closeModal();
      context.invoice.getAllCalc.invalidate();
    },
  });
  const deleteCalc = trpc.invoice.deleteCalcCard.useMutation({
    onSuccess: () => {
      closeModal();
      context.invoice.getAllCalc.invalidate();
    },
  });
  const getCalcById = trpc.invoice.getCalcById.useMutation({
    onSuccess: (data) => {
      setCost(data.cost.toString());
      setCards(data.values as number[]);
    },
  });

  let context = trpc.useUtils();

  useEffect(() => {
    if (id) {
      getCalcById.mutate({ id });
    }
  }, []);

  useEffect(() => {
    setCost(
      currCards
        .reduce((state, curr) => {
          return state + curr;
        }, 0)
        .toString(),
    );
  }, [currCards]);

  if (isLoading || !prices || addNewCalc.isLoading || getCalcById.isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 ">
      <div className="flex items-center justify-center gap-7">
        <Input
          label="Cost"
          type="number"
          state={currCost}
          onChange={() => {
            // const result = e.target.value.replace(/\D/g, "");
            // setCost(result);
          }}
        />
        <select className="h-8  self-end border border-black px-2">
          {prices.map((price) => (
            <option
              key={price.id}
              onClick={() => {
                setCards([...currCards, price.value]);
              }}
              value={price.value}
            >
              {price.value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-h-12 w-full flex-wrap gap-2 rounded-md bg-indigo-900 p-2 text-2xl text-white">
        {currCards.map((card, i) => (
          <p key={i}>
            {i !== 0 && "-"} {card}
          </p>
        ))}
      </div>
      <div className="flex gap-5">
        <PrimaryButton
          label={id ? "update" : "Add"}
          onClick={async () => {
            if (id) {
              updateCalcById.mutate({
                id: id,
                cardsValues: currCards,
                newCost: Number(currCost),
              });
            } else {
              addNewCalc.mutate({
                cardsValues: currCards,
                cost: Number(currCost),
              });
            }
          }}
        />
        {id ? (
          <RedButton
            label="Delete"
            onClick={() => {
              changeComponent({
                newComponent: (
                  <DeleteCalcModal
                    onClick={async () => {
                      await deleteCalc.mutateAsync({ id });
                      closeModal();
                    }}
                  />
                ),
              });
            }}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function DeleteCalcModal({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-5">
      <p className="text-red-500">Do you want to delete this ?</p>
      <div className="w-3/6">
        <RedButton label="Delete" onClick={onClick} />
      </div>
    </div>
  );
}

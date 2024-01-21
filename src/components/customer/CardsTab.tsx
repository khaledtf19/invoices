import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsFillChatSquareTextFill } from "react-icons/bs";

import Container from "../../container/Container";
import { type RouterOutputs, trpc } from "../../utils/trpc";
import { TrpcErrorMessage } from "../../utils/utils";
import {
  IconToCopy,
  LoadingAnimation,
  PrimaryButton,
  RedButton,
} from "../utils";

const CardsTab: React.FC<{
  customerData: RouterOutputs["customer"]["getCustomerById"];
}> = ({ customerData }) => {
  const date = new Date();

  if (!customerData) {
    return <></>;
  }
  const { data: customerNotes, refetch } =
    trpc.customer.getCustomersNotes.useQuery({
      customerId: customerData?.id,
    });
  const createNote = trpc.customer.createCustomerNote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="grid h-full w-full grid-flow-row grid-cols-4 content-center items-center  gap-3">
      <TextToCopy
        text={`${
          date.getHours() >= 12 ? "مساؤ" : "صباحو"
        } هنا \nممكن شحن كروت انترنت\n ${customerData.number} \n ${
          customerData.name
        }`}
      />
      <TextToCopy
        text={`تسلم  ياغالى\nتسلم  يا باشا\nالله يبارك فيك\nهل الجيجات خلصة`}
      />
      <TextToCopy
        text={`ممكن تجديد الباقه\nتمام شكرا لك سيدى الفاضل\nممكن تقديم طلب استكمال المبلغ\nلا مانع من فقد المتبقي`}
      />
      {customerNotes?.map((note) => (
        <TextToCopy key={note.id} text={note.noteContent} noteId={note.id} global={note.global} />
      ))}
      {customerNotes && customerNotes?.length < 5 ? (
        <div
          className="h-fit w-fit cursor-pointer rounded-full bg-green-600 px-3 py-1 hover:bg-blue-600"
          onClick={async () => {
            createNote.mutateAsync({
              customerId: customerData.id,
              text: "new",
            });
          }}
        >
          {createNote.isLoading ? <LoadingAnimation /> : "+"}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CardsTab;

const TextToCopy: React.FC<{ text: string; noteId?: string, global?:boolean }> = ({
  text,
  noteId,
  global
}) => {
  const [textS, setTextS] = useState(text);
  const ctx = trpc.useContext();
  const updateNote = trpc.customer.updateCustomerNote.useMutation({
    onError: (e) => {
      const errorMessage = TrpcErrorMessage(e.message);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to save! Please try again later.");
      }
    },
    onSuccess: () => {
      ctx.customer.getCustomersNotes.invalidate();
    },
  });

  const deleteNote = trpc.customer.deleteNote.useMutation({
    onSuccess: () => {
      ctx.customer.getCustomersNotes.invalidate();
    },
  });

  return (
    <div className="flex flex-col items-center justify-center text-lg">
      <Container size="max-w-sm" className={`${global&& "border-yellow-400 border-4"}`}>
        <textarea
          className={`min-h-[100px]  w-full resize-y bg-black p-2 text-right text-sm  text-white `}
          onChange={(e) => {
            setTextS(e.target.value);
          }}
          value={textS}
        />

        <div className=" flex items-center justify-center gap-3">
          {updateNote.isLoading || deleteNote.isLoading ? (
            <LoadingAnimation />
          ) : (
            <>
              {" "}
              {noteId ? (
                <PrimaryButton
                  label="Update"
                  onClick={async () => {
                    try {
                      await updateNote.mutateAsync({
                        newText: textS,
                        noteId: noteId,
                      });
                    } catch (e) {}
                  }}
                />
              ) : (
                ""
              )}
              <label>
                <IconToCopy
                  name="Text"
                  text={textS}
                  Icon={BsFillChatSquareTextFill}
                  size={20}
                />
              </label>
              {noteId ? (
                <RedButton
                  label="Delete"
                  onClick={async () => {
                    try {
                      await deleteNote.mutateAsync({ noteId: noteId });
                    } catch {}
                  }}
                />
              ) : (
                ""
              )}
            </>
          )}{" "}
        </div>
      </Container>
    </div>
  );
};

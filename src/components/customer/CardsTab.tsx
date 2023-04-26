import Container from "../../container/Container";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { type RouterOutputs, trpc } from "../../utils/trpc";
import { useState } from "react";
import {
  IconToCopy,
  LoadingAnimation,
  PrimaryButton,
  RedButton,
} from "../utils";
import { toast } from "react-hot-toast";
import { TrpcErrorMessage } from "../../utils/utils";

const CardsTab: React.FC<{
  customerData: RouterOutputs["customer"]["getCustomerById"];
}> = ({ customerData }) => {
  const date = new Date();

  if (!customerData) {
    return <></>;
  }
  const { data: customerNotes, refetch } =
    trpc.customer.getCustomersNotes.useQuery({ customerId: customerData?.id });
  const createNote = trpc.customer.createCustomerNote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="grid h-full w-full grid-flow-row grid-cols-4 content-center items-center  gap-3">
      <TextToCopy
        text={`${
          date.getHours() >= 12 ? "مساؤ" : "صباحؤ"
        } هنا \n ممكن شحن كروت\n ${customerData.number} \n ${
          customerData.name
        }`}
      />
      <TextToCopy
        text={`${
          date.getHours() >= 12 ? "مساؤ" : "صباحؤ"
        } هنا \n برجاء تفعيل \n ${customerData.number}`}
      />
      <TextToCopy
        text={`تمام شكرا لك سيدى الفاضل \n كل سنة وسيادتكم والاسرة الكريمه بكامل الصحه والعافيه\n تسلم  يا باشا\n لا مانع من فقد الفترة المتبقيه `}
      />
      {customerNotes?.map((note) => (
        <TextToCopy key={note.id} text={note.noteContent} noteId={note.id} />
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
          +
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CardsTab;

const TextToCopy: React.FC<{ text: string; noteId?: string }> = ({
  text,
  noteId,
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
      <Container>
        <label>
          <IconToCopy
            name="Text"
            text={textS}
            Icon={BsFillChatSquareTextFill}
            size={20}
          />
        </label>
        <textarea
          className="min-h-[100px]  w-full resize-y bg-black p-2 text-right text-sm  text-white"
          onChange={(e) => {
            setTextS(e.target.value);
          }}
          value={textS}
        />

        {noteId ? (
          <div className=" flex items-center justify-center gap-3">
            {updateNote.isLoading || deleteNote.isLoading ? (
              <LoadingAnimation />
            ) : (
              <>
                {" "}
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
                <RedButton
                  label="Delete"
                  onClick={async () => {
                    try {
                      await deleteNote.mutateAsync({ noteId: noteId });
                    } catch {}
                  }}
                />
              </>
            )}{" "}
          </div>
        ) : (
          ""
        )}
      </Container>
    </div>
  );
};

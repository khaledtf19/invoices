import Container from "../../container/Container";
import { BsFillChatSquareTextFill } from 'react-icons/bs'
import { RouterOutputs, trpc } from "../../utils/trpc";
import { useState } from "react";
import { IconToCopy, LoadingAnimation, PrimaryButton, RedButton } from "../utils";
import { toast } from "react-hot-toast";
import { TrpcErrorMessage } from "../../utils/utils";

const CardsTab: React.FC<{ customerData: RouterOutputs["customer"]["getCustomerById"] }> = ({ customerData }) => {
  const date = new Date()

  if (!customerData) {
    return <></>
  }
  const { data: customerNotes, refetch } = trpc.customer.getCustomersNotes.useQuery({ customerId: customerData?.id })
  const createNote = trpc.customer.createCustomerNote.useMutation({
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <div className="grid grid-cols-4 grid-flow-row gap-3 content-center items-center h-full  w-full">
      <TextToCopy text={`${date.getHours() >= 12 ? "مساؤ" : "صباحؤ"} هنا \n ممكن شحن كروت\n ${customerData.number} \n ${customerData.name}`} />
      <TextToCopy text={`${date.getHours() >= 12 ? "مساؤ" : "صباحؤ"} هنا \n برجاء تفعيل \n ${customerData.number}`} />
      <TextToCopy text={`تمام شكرا لك سيدى الفاضل \n كل سنة وسيادتكم والاسرة الكريمه بكامل الصحه والعافيه\n تسلم  يا باشا\n لا مانع من فقد الفترة المتبقيه `} />
      {customerNotes?.map((note) => (
        <TextToCopy text={note.noteContent} noteId={note.id} />
      ))}
      {
        customerNotes && customerNotes?.length < 5 ? <div className="w-fit bg-green-600 py-1 px-3 h-fit rounded-full cursor-pointer hover:bg-blue-600" onClick={async () => {
          createNote.mutateAsync({ customerId: customerData.id, text: "new" })
        }}>+</div>
          : ""
      }
    </div>
  )
}

export default CardsTab

const TextToCopy: React.FC<{ text: string, noteId?: string }> = ({ text, noteId }) => {
  const [textS, setTextS] = useState(text)
  const ctx = trpc.useContext()
  const updateNote = trpc.customer.updateCusomerNote.useMutation({
    onError: (e) => {
      const errorMessage = TrpcErrorMessage(e.message)
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to save! Please try again later.");
      }
    },
    onSuccess: () => {
      ctx.customer.getCustomersNotes.invalidate()
    }
  })

  const deleteNote = trpc.customer.deleteNote.useMutation({
    onSuccess: () => {
      ctx.customer.getCustomersNotes.invalidate()
    }
  })

  return <div className="text-lg flex items-center justify-center flex-col">
    <Container>
      <label>
        <IconToCopy name="Text" text={textS} Icon={BsFillChatSquareTextFill} size={20} />
      </label>
      <textarea className="bg-black  p-2 text-right text-sm text-white w-full resize-y  min-h-[100px]" onChange={(e) => { setTextS(e.target.value) }} value={textS} />

      {noteId ? <div className=" flex items-center justify-center gap-3">{updateNote.isLoading || deleteNote.isLoading
        ? <LoadingAnimation /> : <> <PrimaryButton label="Update" onClick={async () => {
          try {
            await updateNote.mutateAsync({ newText: textS, noteId: noteId })
          } catch (e) {
          }
        }}
        />
          <RedButton label="Delete" onClick={async () => {
            try {
              await deleteNote.mutateAsync({ noteId: noteId })
            } catch {
            }
          }} />


        </>}           </div> : ""}

    </Container>
  </div>
}



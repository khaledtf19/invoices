import Container from "../../container/Container";
import { BsFillChatSquareTextFill } from 'react-icons/bs'
import { RouterOutputs, trpc } from "../../utils/trpc";
import { useState } from "react";
import { IconToCopy, PrimaryButton } from "../utils";

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
    <div className="grid grid-cols-4 gap-3 h-full  w-full">
      <TextToCopy text={`${date.getHours() >= 12 ? "مساؤ" : "صباحؤ"} هنا \n ممكن شحن كروت\n ${customerData.number}`} />
      <TextToCopy text={""} noteId="j" />
      {customerNotes?.map((note) => (
        <TextToCopy text={note.noteContent} noteId={note.id} />
      ))}
      {
        customerNotes && customerNotes?.length < 5 ? <div className="bg-green-600 py-1 px-3 h-fit rounded-full cursor-pointer hover:bg-blue-600" onClick={async () => {
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
  const updateNote = trpc.customer.updateCusomerNote.useMutation()
  return <div className="text-lg flex items-center justify-center flex-col">
    <Container>
      <label>
        <IconToCopy name="Text" text={textS} Icon={BsFillChatSquareTextFill} size={20} />
      </label>
      <textarea className="bg-black  p-2 text-right  text-white w-full resize-y  min-h-[100px]" onChange={(e) => { setTextS(e.target.value) }} value={text} />

      {noteId ? <div className="w-1/3"><PrimaryButton label="Update" /></div> : ""}
    </Container>
  </div>
}



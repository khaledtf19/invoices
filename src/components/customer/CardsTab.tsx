import Container from "../../container/Container";
import { BsFillChatSquareTextFill } from 'react-icons/bs'
import { RouterOutputs } from "../../utils/trpc";

const CardsTab: React.FC<{ customerData: RouterOutputs["customer"]["getCustomerById"] }> = ({ customerData }) => {
  const date = new Date()
  if (!customerData) {
    return <></>
  }
  return (
    <div className="flex justify-end gap-3 w-full">
      <TextToCopy text={`${date.getHours() >= 12 ? "مساء" : "صباح"} الخير لو سمحت عايز اشحن كروت للرقم ده ${customerData.number}`} label="Text1" />
      <TextToCopy text={``} label="Text2" />
    </div>
  )
}

export default CardsTab

const TextToCopy: React.FC<{ text: string, label: string }> = ({ text, label }) => {
  return <div className="text-lg flex items-center justify-center flex-col">
    <Container>
      <label>
        {label}
      </label>
      <p className="bg-black  p-2 text-right  text-white w-full resize-y min-h-[100px]" contentEditable={true}>{text}</p>
    </Container>
  </div>
}

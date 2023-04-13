import Container from "../../container/Container";
import { BsFillChatSquareTextFill } from 'react-icons/bs'
import { RouterOutputs } from "../../utils/trpc";
import { useState } from "react";
import { IconToCopy } from "../utils";

const CardsTab: React.FC<{ customerData: RouterOutputs["customer"]["getCustomerById"] }> = ({ customerData }) => {
  const date = new Date()

  if (!customerData) {
    return <></>
  }

  return (
    <div className="flex flex-row-reverse justify-start gap-3 w-full">
      <TextToCopy text={`${date.getHours() >= 12 ? "مساء" : "صباح"} الخير لو سمحت عايز اشحن كروت للرقم ده ${customerData.number}`} label="Text1" />
      <TextToCopy text={""} label="Text2" />
    </div>
  )
}

export default CardsTab

const TextToCopy: React.FC<{ text: string, label: string }> = ({ text, label }) => {
  const [textS, setTextS] = useState(text)
  return <div className="text-lg flex items-center justify-center flex-col">
    <Container>
      <label>
        <IconToCopy name="Text" text={textS} Icon={BsFillChatSquareTextFill} size={20} />
      </label>
      <textarea className="bg-black  p-2 text-right  text-white w-full resize-y  min-h-[100px]" onChange={(e) => { setTextS(e.target.value) }} value={textS}></textarea>
    </Container>
  </div>
}

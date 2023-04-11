import { useRouter } from "next/router";
import { useState } from "react";
import Container from "../../../container/Container";
import { trpc } from "../../../utils/trpc";

const Cards = () => {
  const router = useRouter()

  const [text1, setText1] = useState("")

  const { id } = router.query;

  const {
    data: customerData,
    isLoading,
  } = trpc.customer.getCustomerById.useQuery(
    {
      customerId: String(id),
    },
    {
      onSuccess: (data) => {
        setText1(`مساء الخير لو سمحت عايز اشحن كروت للرقم ده ${data?.number}`)
      }
    }
  );

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!customerData) {
    return <div>can not find this customer</div>
  }




  return (
    <Container>
      <p className="bg-black  p-2 text-right  text-white w-full resize-y min-h-[100px]" contentEditable={true}>{text1}</p>

      {customerData?.name}
    </Container>
  )
}

export default Cards

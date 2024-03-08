import { PrimaryButton } from "../components/utils";
import { trpc } from "../utils/trpc";

export default function ExportPage(){

  const customers = trpc.export.getAllCustomers.useMutation({
    onSuccess: (data)=>{
      exportData(data, "customersData")
    }
  });

  const invoices = trpc.export.getlatestInvoices.useMutation({
    onSuccess: (data)=>{
      exportData(data, "invoicesData")
    }
  })

  const bankChanges = trpc.export.getAllChangeBank.useMutation({
    onSuccess: (data)=>{
      exportData(data, "changeBankData")
    }
  })

  const cusomersDept = trpc.export.getAllDept.useMutation({
    onSuccess: (data)=>{
      exportData(data, "deptData")
    }
  })

  const customersCards = trpc.export.getAllCustomersCards.useMutation({
    onSuccess: (data)=>{
      exportData(data, "customersCardsData")
    }
  })

  const calcCards = trpc.export.getAllCalcCards.useMutation({
    onSuccess: (data)=>{
      exportData(data, "calcCardsData")
    }
  })
    
  const exportData = (data:unknown, name: string) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = name + ".json";

    link.click();
  };

  return <div className="flex flex-col gap-5 w-48">
    <PrimaryButton onClick={async ()=>{
      await customers.mutateAsync()
    }} label="Cusomers" />

    <PrimaryButton onClick={async ()=>{
      await invoices.mutateAsync()
    }} label="Invoices" />
    
    <PrimaryButton onClick={async ()=>{
      await bankChanges.mutateAsync()
    }} label="Bank Changes" />

    <PrimaryButton onClick={async ()=>{
      await cusomersDept.mutateAsync()
    }} label="Customers Debt" />

    <PrimaryButton onClick={async ()=>{
      await customersCards.mutateAsync()
    }} label="Cusomer Cards" />

    <PrimaryButton onClick={async ()=>{
      await calcCards.mutateAsync()
    }} label="Calc Cards" />
  </div>
}

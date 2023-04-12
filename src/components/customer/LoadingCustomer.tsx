import Container from "../../container/Container";
import CustomerData from "../customer/CustomerData";
import LoadingTable from "../tables/LoadingTable";
import { Toggle } from "../utils";

const LoadingCustomer = () => {
  return (
    <div className="flex w-full animate-pulse flex-col items-center justify-center gap-6  blur-sm">
      <Container size="max-w-md">
        <Toggle />
        <CustomerData
          customerData={{
            id: "1234567",
            name: "Name Name Name",
            number: String(132424242),
            idNumber: String(132424242),
            address: "address",
            mobile: [String(132424242)],
            birthday: "1/1/1111",
          }}
        />
      </Container>

      <LoadingTable type="small" />
    </div>
  );
};
export default LoadingCustomer;

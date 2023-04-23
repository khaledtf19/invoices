import { useEffect, useState } from "react";
import Container from "../container/Container";
import { Input, PrimaryButton, SecondaryButton } from "../components/utils";
import { useSession } from "next-auth/react";
import { UserRoleArr } from "../types/utils.types";
import { trpc } from "../utils/trpc";
import { useModalState } from "../hooks/modalState";

const Admin = () => {
  const [password, setPassword] = useState("");
  const { openModal } = useModalState();
  const { data } = useSession();

  const makeAdmin = trpc.auth.makeAdmin.useMutation();
  const makeBank = trpc.user.createNewBank.useMutation();

  const ctx = trpc.useContext();

  useEffect(() => {
    console.log("error", makeAdmin.error?.message);
    if (makeAdmin.error?.message) {
      openModal({ newText: makeAdmin.error?.message });
    }
  }, [makeAdmin.error, openModal]);

  return (
    <Container size="max-w-md">
      <h1>ADMIN</h1>
      <p className=" text-lg text-green-600">
        {data?.user?.role === UserRoleArr[1]
          ? "You are an ADMIN"
          : "You are a USER"}
      </p>

      <div className=" flex flex-col gap-5">
        <Input
          name="adminPassword"
          label="Admin Password"
          placeholder="Password"
          state={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <PrimaryButton
          type="button"
          label="Enter"
          onClick={async () => {
            try {
              await makeAdmin.mutateAsync({ adminPassword: password });
            } catch (e) {
              console.log(e);
            }
          }}
        />
        <SecondaryButton
          label="Create Bank"
          onClick={async () => {
            try {
              await makeBank.mutateAsync();
              ctx.user.getBank.invalidate();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </div>
    </Container>
  );
};

export default Admin;

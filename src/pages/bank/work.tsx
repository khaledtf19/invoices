import * as React from "react";

import { RedButton } from "../../components/utils";
import Container from "../../container/Container";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Work = () => {
  const [cells, setcells] = React.useState([0]);

  return (
    <Container>
      <div className="flex w-full ">
        <CellContainer />
      </div>
    </Container>
  );
};

export default Work;
export const CellContainer = () => {
  return (
    <div className="flex w-full gap-2">
      <Cell />
      <div className="w-10">
        <RedButton label="X" />
      </div>
    </div>
  );
};

export const Cell = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }) => {
    return (
      <input
        type={type}
        className="w-full border border-gray-900 p-1 outline-none"
      />
    );
  },
);
Cell.displayName = "Cell"

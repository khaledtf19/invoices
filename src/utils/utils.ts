export const BigNumberLength = 999_999_999_999_999;
export const MinNumberLength = 9999;

export const DateFormat: (data: { date: Date }) => string = ({ date }) => {
  return date.toLocaleString("en-GB", {
    timeStyle: "short",
    dateStyle: "short",
  });
};

export const validateExcelData = (data: any[]): boolean => {
  return data.every(
    (row) =>
      typeof row.name === "string" &&
      row.name.trim() !== "" &&
      typeof row.email === "string" &&
      row.email.trim() !== "" &&
      typeof row.gift === "string" &&
      row.gift.trim() !== ""
  );
};

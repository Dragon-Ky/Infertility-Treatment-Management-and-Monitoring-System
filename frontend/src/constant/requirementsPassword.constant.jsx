export const requirements = [
  { re: /.{8,}/, label: "Ít nhất 8 ký tự" },
  { re: /[A-Z]/, label: "Ít nhất 1 chữ hoa" },
  { re: /[0-9]/, label: "Ít nhất 1 chữ số" },
  { re: /[^A-Za-z0-9]/, label: "Ít nhất 1 ký tự đặc biệt" },
];

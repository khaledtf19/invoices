const config = {
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    require.resolve("@trivago/prettier-plugin-sort-imports"),
  ],
  importOrder: ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;

export const componentRules: Record<string, { canHaveChildren: boolean }> = {
  Container: { canHaveChildren: true },
  Button: { canHaveChildren: false },
  Text: { canHaveChildren: false },
};

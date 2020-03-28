export const distinctCollection = <T>(items: T[]) => {
  return items.filter((id, index) => {
    return items.indexOf(id) === index;
  });
};

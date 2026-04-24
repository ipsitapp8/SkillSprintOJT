
export const getApiBase = () => {
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
};

export const getWsBase = () => {
  const base = getApiBase();
  return base.replace(/^http/, 'ws');
};

import PiNetwork from "pi-backend";

export const pi = new PiNetwork(
  process.env.PI_API_KEY as string,
  process.env.PI_SECRET_KEY as string
);

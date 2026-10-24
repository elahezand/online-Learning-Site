import { z } from "zod";
import { text } from "./common";

export const searchParams = z.object({ value: text("Search term", { max: 80 }) });

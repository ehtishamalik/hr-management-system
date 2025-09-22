import z from "zod";

import { LEAVE_YEAR_FORM_SCHEMA } from "./schema";

export type LeaveYearFormSchemaType = z.infer<typeof LEAVE_YEAR_FORM_SCHEMA>;

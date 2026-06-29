export type DbError<TParams = unknown[]> = {
  query: string;
  params: TParams;
  cause: {
    name: string;
    severity: "ERROR" | "FATAL" | "PANIC";
    code: string;
    detail: string;
    schema: string;
    table: string;
    line: string;
    constraint: string;
    file: string;
    routine?: string;
    stack?: string;
  };
};

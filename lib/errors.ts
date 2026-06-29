type AppErrorCause = {
  detail: string;
  status: number;
};

export class AppError extends Error {
  cause: AppErrorCause;

  constructor(message: string, cause: AppErrorCause) {
    super(message);
    this.cause = cause;
  }
}

export class ForbiddenError extends AppError {
  constructor(detail: string) {
    super("Forbidden", {
      detail,
      status: 403,
    });
  }
}

export interface ApiErrorOptions extends ErrorOptions {
  status?: number;
  statusText?: string;
}

export class ApiError extends Error {
  status?: number;
  statusText?: string;

  constructor(
    message?: string,
    { status, statusText, cause }: ApiErrorOptions = {},
  ) {
    super(message, cause ? { cause } : {});
    this.status = status;
    this.statusText = statusText;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(message, { status: 404, statusText: "Not found" });
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, { status: 401, statusText: "Unauthorized" });
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, { status: 403, statusText: "Forbidden" });
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, { status: 400, statusText: "Bad Request" });
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, { status: 409, statusText: "Conflict" });
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(message, { status: 500, statusText: "Internal Server Error" });
  }
}

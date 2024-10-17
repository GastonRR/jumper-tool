export class TagError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'TagError';
    this.statusCode = statusCode || 500;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProjectError extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ProjectError';
    this.statusCode = statusCode || 500;

    Error.captureStackTrace(this, this.constructor);
  }
}

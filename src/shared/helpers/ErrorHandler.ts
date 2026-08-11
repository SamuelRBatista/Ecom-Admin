export class ErrorHandler {
  static formatErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Ocorreu um erro inesperado';
  }

  static getErrorMessages(errors: any): { [key: string]: string } {
    const messages: { [key: string]: string } = {};

    if (errors?.response?.data?.errors) {
      for (const [key, value] of Object.entries(errors.response.data.errors)) {
        messages[key] = Array.isArray(value) ? value[0] : value;
      }
    }

    return messages;
  }

  static isNetworkError(error: any): boolean {
    return !error?.response;
  }

  static isValidationError(error: any): boolean {
    return error?.response?.status === 400 || error?.response?.status === 422;
  }

  static isUnauthorizedError(error: any): boolean {
    return error?.response?.status === 401;
  }

  static isForbiddenError(error: any): boolean {
    return error?.response?.status === 403;
  }

  static isNotFoundError(error: any): boolean {
    return error?.response?.status === 404;
  }

  static isServerError(error: any): boolean {
    return error?.response?.status >= 500;
  }
}

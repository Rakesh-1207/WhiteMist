export class ApiResponse {
  static success(res, message = 'Success', data = {}, statusCode = 200, meta = null) {
    const response = {
      success: true,
      message,
      data,
    };
    if (meta) {
      response.meta = meta;
    }
    return res.status(statusCode).json(response);
  }

  static created(res, message = 'Resource created successfully', data = {}) {
    return this.success(res, message, data, 201);
  }

  static error(res, message = 'An error occurred', error = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error || { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
}

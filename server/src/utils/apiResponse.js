export const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

export const errorResponse = (message = 'Error', code = 400) => ({
  success: false,
  error: message,
  code
});

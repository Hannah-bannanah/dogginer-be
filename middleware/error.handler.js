// import 3rd party modules
const mongoose = require('mongoose');

exports.errorHandler = async (error, req, res, next) => {
  console.log(error);
  let errorData = {
    httpStatus: error.httpStatus,
    message: error.message,
  };
  if (!errorData.httpStatus) {
    errorData = getResponseError(error);
  }
  res.status(errorData.httpStatus).send({ error: errorData.message });
};

const getResponseError = error => {
  let httpStatus;
  let message;
  if (error.code === 11000) {
    httpStatus = 400;
    message = 'Entrada duplicada';
  } else if (error instanceof mongoose.Error.ValidationError) {
    httpStatus = 422;
    message = 'Informacion invalida';
  } else {
    httpStatus = 500;
    message = 'Internal server error';
  }
  return { httpStatus, message };
};

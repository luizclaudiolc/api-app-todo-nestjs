const password =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export const REGEX_HELPERS = {
  password,
};

export const MESSEGE_HELPERS = {
  default: 'A senha deve conter letras maiúscula, minuscula, símbulo e número',
};

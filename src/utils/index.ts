import { createHash } from 'crypto';

// md5加密
export const md5 = (content) => {
  const md5 = createHash('md5');
  return md5.update(content).digest('hex');
};

// 加密函数
export const enPassword = (password) => {
  const str = `password=${password}&secret=${process.env.USER_SECRET_KEY}`;
  return md5(str);
};

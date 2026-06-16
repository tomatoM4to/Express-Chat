const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message || '알 수 없는 오류가 발생했습니다.';

  // Mongoose 중복 키 에러 (ID 중복, 방 이름 중복 등)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `이미 존재하는 ${field === 'name' ? '방 이름' : '아이디'}입니다.`;
  }

  // Mongoose 유효성 검사 에러
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  console.error(`[Error Handler] ${status} - ${message}`);

  // 세션이 있는 경우 Flash 메시지를 담아 안전하게 리다이렉트
  if (req.flash) {
    req.flash('error_msg', message);
    // Referer 헤더가 없으면 기본값으로 '/' 사용 (Cannot GET /back 방지)
    const backURL = req.get('Referer') || '/';
    return res.redirect(backURL);
  }

  // API 요청 등 세션이 없는 경우 JSON 반환
  res.status(status).json({
    error: 'InternalError',
    message: message
  });
};

module.exports = errorHandler;

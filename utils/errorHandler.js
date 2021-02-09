module.exports = (res, error) => { //! res сможет отправлять сообщение обратно клиенту
  res.status(500).json({
    success: false,
    message: error.message ? error.message : error
  })
  
}
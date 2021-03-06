function jsonParser(req, res, next){
  let body = '';
  if (req.is('json')) {
    req.on('data', (chunk) => {
      body += chunk;
    })
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
        next();
      } catch (e) {
        console.error(e)
        res.status(404).end();
      }
    })
  } else {
    next();
  }
}

function requestLog(req, res, next){
  let start = Date.now();
  res.once('finish', () => {
    let end = Date.now();
    let timeTook = end - start;
    let log= `Method: ${req.method}, Path: ${req.path}, Status: ${res.statusCode}, Response time: ${timeTook} ms`
    console.log(log)
  });
  next();
}

module.exports = {
  jsonParser,
  requestLog
}
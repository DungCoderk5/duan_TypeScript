var express = require('express');
var router = express.Router();
// method: get, port, put, deletenpm 
/* GET home page. */
router.get('/', function(req, res, next) {
  // writeHeader; write
  // view giao diện
  res.render('index', { title: 'Express', mess: 'Xin chào' });
});

const sinhvien =[
  {id: 1, name: 'Nguyen Van A', age: 20},
  {id: 2, name: 'Nguyen Van B', age: 21},
  {id: 3, name: 'Nguyen Van C', age: 22}
]
// http://localhost:3000/sinh_vien/2
router.get('/sinh_vien/:id', function(req, res) {
  // writeHeader; write
  // view giao diện
  try {
    const [id]=req.params;
    const sv= sinhvien.find(item=>item.id ===parseInt(id));
    return res.send(`<h1>`)
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
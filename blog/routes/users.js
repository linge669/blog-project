var express = require('express');
var router = express.Router();
var upload=require('./upload');
var ObjectId=require('mongodb').ObjectId;
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/user';
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//添加新的文章
router.post('/newblog',(req,res)=>{

	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('articel',(err,coll)=>{
			
					coll.insertOne({blog_tit:req.body.blog_tit,blog_con:req.body.blog_con,"time":new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+ " "+new Date().toLocaleTimeString()},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})

//登录管理员密码
router.post('/update',(req,res)=>{

	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('admin',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					req.session.name=data[0].name;
					console.log(req.session.name);
					res.send('1');
				}else{
					res.send('0');
				}
					database.close();
			})
		})
	})
})

//游客注册
router.post('/register',(req,res)=>{

	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('bloginfo',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					res.send('0');
				}else{
					coll.insertOne(req.body,()=>{
						res.send('1');
					})
				}
					database.close();
			})
		})
	})
})

//游客登录
router.post('/login',(req,res)=>{

	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('bloginfo',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					req.session.username=data[0].username;
					
					res.send('1');
				}else{
					res.send('0');
				}
					database.close();
			})
		})
	})
})

//评论
router.post('/pl',(req,res)=>{

	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('pl',(err,coll)=>{
					coll.insertOne({pl_con:req.body.pl_con,username:req.body.username,artname:req.body.art_id,"time":new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+ " "+new Date().toLocaleTimeString()},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})
//留言
router.post('/ly',(req,res)=>{

	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('blog_ly',(err,coll)=>{
					coll.insertOne({ly_con:req.body.ly_con,username:req.body.username,"time":new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+ " "+new Date().toLocaleTimeString()},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})
//删除留言
router.post('/delete',(req,res)=>{
	var id=ObjectId(req.body.ly_id);
	console.log(id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('blog_ly',(err,coll)=>{
					coll.remove({_id:id},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})

router.post('/uploadImg',(req,res)=>{
	upload(req,res)
})

module.exports = router;

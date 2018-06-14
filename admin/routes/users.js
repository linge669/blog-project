var express = require('express');
var router = express.Router();
var ObjectId=require('mongodb').ObjectId;
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/user';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//首页
router.post('/login',(req,res)=>{
	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('admin',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					req.session.name=data[0].name;
					res.send('1');
				}else{
					res.send('0');
				}
					database.close();
			})
		})
	})
})
//修改管理员账号密码
router.post('/updateadmin',(req,res)=>{
	/*console.log(req.body);*/
	mongodb.connect(db_str,(err,database)=>{
		database.collection('admin',(err,coll)=>{
			coll.find({name:req.body.name,password:req.body.password}).toArray((err,data)=>{
				console.log(data)
				if(data.length>0){
					console.log(req.body.newPsw)
					coll.update({"name":req.body.name},{$set:{password:req.body.newPsw}})
					res.send('1');
				}else{
					res.send('0');
				}
					database.close();
			})
		})
	})
})
//编辑博客
router.post('/updateblog',(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection('articel',(err,coll)=>{
			coll.update({"_id":ObjectId(req.body._id)},{$set:{blog_tit:req.body.blog_tit,blog_con:req.body.blog_con,time:new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+ " "+new Date().toLocaleTimeString()}})
		
			})
					
		})
	})
//新增博客
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
//新增用户
router.post('/adduser',(req,res)=>{

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

//编辑用户
router.post('/updateuser',(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection('bloginfo',(err,coll)=>{
			coll.update({"_id":ObjectId(req.body._id)},{$set:{username:req.body.username,userpsw:req.body.userpsw,time:new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+ " "+new Date().toLocaleTimeString()}})
		
			})
					
		})
	})
//博客删除
router.post('/delete',(req,res)=>{
	var id=ObjectId(req.body.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('articel',(err,coll)=>{
					coll.remove({_id:id},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})
//删除留言
router.post('/delete_ly',(req,res)=>{
	var id=ObjectId(req.body.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('blog_ly',(err,coll)=>{
					coll.remove({_id:id},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})
//删除评论
router.post('/delete_pl',(req,res)=>{
	var id=ObjectId(req.body.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('pl',(err,coll)=>{
					coll.remove({_id:id},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})
//删除用户
router.post('/delete_user',(req,res)=>{
	var id=ObjectId(req.body.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('bloginfo',(err,coll)=>{
					coll.remove({_id:id},()=>{
						res.send('1');
					})
					database.close();
		})
	})
})
//博客搜索
router.post("/con_search",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("articel",(err,coll)=>{
			coll.find({$or:[{blog_tit:{$regex:req.body.search_con}},{blog_con:{$regex:req.body.search_con}}]}).toArray((err,data)=>{
				res.send(data);
			})
		})
	})
})


//留言查找

router.post("/ly_search",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("blog_ly",(err,coll)=>{
			coll.find({$or: [ { username: {$regex:req.body.search_con} }, {  ly_con:{$regex:req.body.search_con}} ] }).toArray((err,data)=>{
				
				res.send(data);
			})
		})
	})
})

//评论查找
router.post("/pl_search",(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection("pl",(err,coll)=>{
			coll.find({$or: [ { username: {$regex:req.body.search_con} }, {  pl_con:{$regex:req.body.search_con}},{  artname:{$regex:req.body.search_con}} ] }).toArray((err,data)=>{
				
				res.send(data);
			})
		})
	})
})


module.exports = router;

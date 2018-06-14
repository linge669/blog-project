var express = require('express');
var router = express.Router();
var ObjectId=require('mongodb').ObjectId;
var async=require('async');
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://10.8.161.28:27017/user";
/* GET home page. */

router.get('/archives', function(req, res, next) {
  res.render('archives', {title: '归档--昙花三现--个人博客',username:req.session.username });
});

router.get('/error', function(req, res, next) {
  	res.render('error',{title: '昙花三现--个人博客',username:req.session.username})
});

//留言
router.get('/gustbook', function(req, res, next) {
	
		var pageNo=req.query.pageNo;
		pageNo=pageNo?pageNo:1;
		var size=10;
		var count=0;
		var page=0;
		mongodb.connect(db_str,(err,database)=>{
		database.collection('blog_ly',(err,coll)=>{
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size) 
						pageNo=pageNo<1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						callback(null,'')
					})
				},
				function(callback){
					coll.find({}).sort({_id:-1}).limit(size).skip((pageNo-1)*size)
					.toArray((err,data)=>{
						callback(null,data)
					})
				}
			],function(err,data){
//				console.log(data)
				res.render('gustbook',{data:data[1],size:size,count:count,page:page,pageNo:pageNo,name:req.session.name,title: '留言--昙花三现--个人博客',username:req.session.username})
				database.close()
			})
		})
	})	
})

router.get('/relogin', function(req, res, next) {
  	req.session.destroy((err)=>{
  		res.redirect('/')
  	})
});

router.get('/link', function(req, res, next) {
  	res.render('link',{title: '链接--昙花三现--个人博客' })
});
router.get('/update', function(req, res, next) {
  	res.render('update',{title: '管理员登录--昙花三现--个人博客',name:req.session.name})
});
router.get('/register', function(req, res, next) {
  	res.render('register',{title: '游客注册--昙花三现的个人博客',username:req.session.username})
});
router.get('/login', function(req, res, next) {
  	res.render('login',{title: '游客登录--昙花三现的个人博客',username:req.session.username})
});
router.get('/newblog', function(req, res, next) {
  	res.render('newblog',{title: '添加新的文章--昙花三现--个人博客',name:req.session.name})
});
//新增文章
router.get('/', function(req, res, next) {
		var pageNo=req.query.pageNo;
		pageNo=pageNo?pageNo:1;
		var size=5;
		var count=0;
		var page=0;
		mongodb.connect(db_str,(err,database)=>{
		database.collection('articel',(err,coll)=>{
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size) 
						pageNo=pageNo<1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						
						callback(null,'')
					})
				},
				function(callback){
					coll.find({}).limit(size).skip((pageNo-1)*size)
					.toArray((err,data)=>{
						callback(null,data)
					})
				}
			],function(err,data){

				res.render('index',{data:data[1],size:size,count:count,page:page,pageNo:pageNo,title: '昙花三现--个人博客',username:req.session.username})
				database.close()
			})
		})
	})	
})
//文章详情

router.get('/detail', function(req, res, next) {
		
		var count=0;
		var id=ObjectId(req.query.id)
		mongodb.connect(db_str,(err,database)=>{
			async.parallel([
				function(callback){
					database.collection('articel',(err,coll)=>{
							coll.find({_id:id}).toArray((err,data)=>{
								callback(null,data);
								database.close();
							})
					})
				},
				function(callback){
					database.collection('pl',(err,coll)=>{
						coll.find({}).toArray((err,data)=>{
							count=data.length;
							callback(null,'');
							database.close();
						})
					})
				},
				function(callback){
					
					database.collection('pl',(err,coll)=>{
						coll.find({}).sort({_id:-1}).toArray((err,data)=>{
							callback(null,data);
							database.close();
						})
					})
				}
			],function(err,data){
				res.render('detail',{result:data[0][0],pl_data:data[2],title: '昙花三现--个人博客',username:req.session.username,name:req.session.name})
				database.close()
			})
		
	})	
})



module.exports = router;

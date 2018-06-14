var express = require('express');
var router = express.Router();
var ObjectId=require('mongodb').ObjectId;
var async=require('async');
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://10.8.161.28:27017/user";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {name:req.session.name});
});
router.get('/header', function(req, res, next) {
  res.render('header', {name:req.session.name});
});
router.get('/login', function(req, res, next) {
  res.render('login', { });
});
router.get('/relogin', function(req, res, next) {
  	req.session.destroy((err)=>{
  		res.redirect('/')
  	})
});
//用户列表
router.get('/userlist', function(req, res, next) {
		var pageNo=req.query.pageNo;
		pageNo=pageNo?pageNo:1;
		var size=10;
		var count=0;
		var page=0;
		mongodb.connect(db_str,(err,database)=>{
		database.collection('bloginfo',(err,coll)=>{
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
				res.render('userlist',{data:data[1],size:size,count:count,page:page,pageNo:pageNo,name:req.session.name})
				
				database.close()
			})
		})
	})	
})

//博客列表
router.get('/bloglist', function(req, res, next) {
		var pageNo=req.query.pageNo;
		pageNo=pageNo?pageNo:1;
		var size=4;
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
				res.render('bloglist',{data:data[1],size:size,count:count,page:page,pageNo:pageNo,result:req.session.result,username:req.session.username,name:req.session.name})
				
				database.close()
			})
		})
	})	
})
router.get('/create', function(req, res, next) {
  res.render('create', { });
});
router.get('/createblog', function(req, res, next) {
  res.render('createblog', {name:req.session.name });
});
//更新博客渲染
router.get('/updateblog', function(req, res, next) {
		
		var id=ObjectId(req.query.id)
		mongodb.connect(db_str,(err,database)=>{
			database.collection('articel',(err,coll)=>{
					coll.find({_id:id}).toArray((err,data)=>{
						res.render('updateblog',{data:data[0],name:req.session.name})
						database.close()
							})
				})
		})
	})

//编辑用户渲染
router.get('/updateuser', function(req, res, next) {
		
		var id=ObjectId(req.query.id)
		mongodb.connect(db_str,(err,database)=>{
			database.collection('bloginfo',(err,coll)=>{
					coll.find({_id:id}).toArray((err,data)=>{
						res.render('updateuser',{data:data[0],name:req.session.name})
						database.close()
							})
				})
		})
	})
router.get('/updateuser', function(req, res, next) {
  res.render('updateuser', {name:req.session.name });
});

router.get('/error', function(req, res, next) {
  res.render('error', {name:req.session.name });
});
//评论获取
router.get('/pl', function(req, res, next) {
		var pageNo=req.query.pageNo;
		pageNo=pageNo?pageNo:1;
		var size=5;
		var count=0;
		var page=0;
		mongodb.connect(db_str,(err,database)=>{
		database.collection('pl',(err,coll)=>{
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
				res.render('pl',{data:data[1],size:size,count:count,page:page,pageNo:pageNo,name:req.session.name})
				database.close()
			})
		})
	})	
})
//留言获取
router.get('/ly', function(req, res, next) {
		var pageNo=req.query.pageNo;
		pageNo=pageNo?pageNo:1;
		var size=4;
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
					coll.find({}).limit(size).skip((pageNo-1)*size)
					.toArray((err,data)=>{
						callback(null,data)
					})
				}
			],function(err,data){
				res.render('ly',{data:data[1],size:size,count:count,page:page,pageNo:pageNo,result:req.session.result,name:req.session.name})
				database.close()
			})
		})
	})	
})
router.get('/myInfo', function(req, res, next) {
  res.render('myInfo', {name:req.session.name });
});

module.exports = router;

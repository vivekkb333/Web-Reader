var request = require('request');
var http = require('http');
var path = require('path');
var express = require('express');
var app=express();
var bodyParser = require('body-parser')
var Q = require("q")
var word,author;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/reader.html'));
})

app.get('/laststory',function(req,res){
	
	last().then(function(data){
		res.send(data);
	})
   
})
	
app.get('/frontpage',function(req,res){

	front()
	.then(function(data){
		console.log('data',data)
		res.send(data)
	})

})

app.post('/search',function(req,res){
	word=req.body.word_value;
	console.log('word',word)

})

app.get('/search_word',function(req,res){
	search(word).then(function(data){
		console.log('data',data);
		res.send(data)
	})
})	

app.post('/search_auth',function(req,res){
	author=req.body.word_value;
	console.log('author',author);
})

app.get('/search_author',function(req,res){
	search_author(author).then(function(data){
		console.log('data',data);
		res.send(data)
	})
})


function front (){
	var d = Q.defer()

	request('http://hn.algolia.com/api/v1/search?tags=front_page', function(err, res, body) {  
	data = JSON.parse(body);
	d.resolve(data)
})
	return d.promise
}

function last(){
	var d= Q.defer()
	request('http://hn.algolia.com/api/v1/search_by_date?tags=story', function(err, res, body) {  
	data = JSON.parse(body);
	d.resolve(data)

})
	return d.promise
}

function search(word){
	var d= Q.defer()
	request('http://hn.algolia.com/api/v1/search?query='+word+'&tags=story', function(err, res, body) {  
	data = JSON.parse(body);
	d.resolve(data)

})
	return d.promise
}

function search_author(word){
	var d= Q.defer()
	request('http://hn.algolia.com/api/v1/search?tags=story,author_'+word, function(err, res, body) {  
	data = JSON.parse(body);
	d.resolve(data)

})
	return d.promise
}

app.listen(3000,function(){
	console.log("Listening on 3000");
});
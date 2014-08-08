var google = google || {};

google.appengine = google.appengine || {};

google.appengine.samples = google.appengine.samples || {};

google.appengine.samples.trytresor = google.appengine.samples.trytresor || {};

google.appengine.samples.trytresor.CLIENT_ID =
    '610127952776-b1ksgf4fgsv9d1ink49419iv4dghm6np.apps.googleusercontent.com';

google.appengine.samples.trytresor.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

google.appengine.samples.trytresor.signedIn = false;

google.appengine.samples.trytresor.userAuthed = function(){
	var request = gapi.client.oauth2.userinfo.get().execute(function(resp){
		if(!resp.code){
			google.appengine.samples.trytresor.signedIn = true;
			document.querySelector('#signinButton').textContent = 'Sign out';
			document.querySelector('#authGreeting').disabled = false;
		}
	});
};

google.appengine.samples.trytresor.signin = function(mode, callback){
	gapi.auth.authorize({client_id: google.appengine.samples.trytresor.CLIENT_ID,
	                                     scope: google.appengine.samples.trytresor.SCOPES,
	                                     immediate: mode},
	                                     callback);
};

google.appengine.samples.trytresor.auth = function(){
	if(!google.appengine.samples.trytresor.signedIn){
		google.appengine.samples.trytresor.signin(false,
			google.appengine.samples.trytresor.userAuthed);
	}else{
		google.appengine.samples.trytresor.signedIn = false;
		document.querySelector('#signinButton').textContent = 'Sign in';
		document.querySelector('#authedGreeting').disabled = true;
	}
};

google.appengine.samples.trytresor.print = function(data){
	var element = document.createElement('div');
	element.classList.add('row');
	element.innerHTML = data.user_name + "  " + data.user_token;
	document.querySelector('#outputLog').appendChild(element);
};

google.appengine.samples.trytresor.enterdata = function(user_name, user_token){
	gapi.client.trytresor.datas.insert({'user_name': user_name, 'user_token': user_token}).execute(
		function(resp){
			if(!resp.code){
				google.appengine.samples.trytresor.print(resp);	
			}
		});
};

google.appengine.samples.trytresor.listdata = function(){
	gapi.client.trytresor.datas.list().execute(
		function(resp){
			if(!resp.code){
				resp.items = resp.items || [];
				for(var i = 0; i<resp.items.length; i++){
					google.appengine.samples.trytresor.print(resp.items[i]);
				}
			}
		});
};

google.appengine.samples.trytresor.enableButtons = function(){
	var  insertdata = document.querySelector('#insertdata');
	insertdata.addEventListener('click', function(e){
		google.appengine.samples.trytresor.enterdata(
			document.querySelector('#name').value,
			document.querySelector('#token').value);
	});

	var listdata = document.querySelector('#listdata');
	listdata.addEventListener('click',
		google.appengine.samples.trytresor.listdata);
};

google.appengine.samples.trytresor.init = function(apiRoot){
	var apisToLoad;
	var callback = function(){
		if(--apisToLoad == 0){
			google.appengine.samples.trytresor.enableButtons();
			google.appengine.samples.trytresor.signin(true,
				google.appengine.samples.trytresor.userAuthed);
		}
	}

	apisToLoad = 2;
	gapi.client.load('trytresor', 'v1', callback, apiRoot);
	gapi.client.load('oauth2','v2',callback);
};


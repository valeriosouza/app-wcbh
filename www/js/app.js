angular.module('app', ['ionic', 'gettext', 'angular.filter', 'ngResource', 'ngStorage'])
.factory('CFG', function(){
  var CFG = {
      'name' : 'WordCamp Belo Horizonte'  
    , 'date' : '14 de Julho de 2015'
    , 'api'  : 'http://belohorizonte.wordcamp.org/2015/wp-json/'
    , 'gravatarAPI': 'http://gravatar.com'
  };
  CFG.imgs = {
      'logo' : 'lib/imgs/logo.png'
    , 'headerBackground' : 'lib/imgs/bg1.jpg'
    , 'sessionsDefault' : ''
    , 'sessionsBackground' : ''
  };
  CFG.guides = {
      'guidesIndex': '1772'
    , guides: [
      '1774',
      '1785',
      '1787',
      '1777',
      '1779',
      '1782',
      '17'
    ]
  };
  CFG.sponsorsLogos = [
      'lib/imgs/jetpack.jpg'
    , 'lib/imgs/wpml.jpg'
    , 'lib/imgs/woothemes.jpg'
    , 'lib/imgs/unibh.jpg'
    , 'lib/imgs/multiad.jpg'
    , 'lib/imgs/bluehost.jpg'
    , 'lib/imgs/10up.jpg'
  ]
  return CFG;
})
.factory('GravatarService', function($http, CFG, $resource){
  var GravatarService = {};
  GravatarService.getHash = function(email){
      return md5(email);
    }
  GravatarService.api = $resource(CFG.gravatarAPI+'/:hash', {hash: '@hash'});

  return GravatarService;
})
.factory('API', function($resource, CFG) {
  var mainURL = CFG.api;
  return $resource(mainURL+'posts/:id', {id:'@id'});
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        console.log('config eh ', config);
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        console.log('response é ', response);
        return response
      },
      responseError: function(err){
        $rootScope.$broadcast('loading:hide');
        switch(err.status){
          case 0:
              err.message = 'Não foi possível conectar. \n (Você tem certeza que está online?)';
            break;
          case 404 :
            err.message = 'Não encontrado. (Erro 404). Desculpa.'
            break;
        }
       //  return $rootScope.showAlert = function() {
       //   var alertPopup = $ionicPopup.alert({
       //     title: 'Error!',
       //     template: err.message
       //   });
       //   alertPopup.then(function(res) {
       //     console.log('Thank you for not eating my delicious ice cream cone');
       //   });
       // };
        alert(err.message)
        return err
      }
    }
  })
})

.run(function($rootScope, $ionicLoading, CFG) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    })
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  })
})
.directive('a', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      if ( !attrs.href ){
        return;
      }
      var externalRe = new RegExp("^(http|https)://");
      var url = attrs.href;
      if(externalRe.test(url)) {
        element.on('click',function(e){
          e.preventDefault();
          if(attrs.ngClick){
           scope.$eval(attrs.ngClick);
         }
         window.open(encodeURI(url), '_system');
       });
      }
    }
  };
})
.run(function (gettextCatalog) {
    gettextCatalog.setCurrentLanguage('pt_BR');
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "views/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.start', {
        url: "/start",
        views: {
          'menuContent' :{
            templateUrl: "views/start.html",
            controller: 'StartCtrl'
          }
        }
    })
    .state('firstTime', {
      url: '/firsttime',
      templateUrl: 'views/firstTime.html',
      controller: 'FirstTimeCtrl'
    })
    .state('app.addGravatar', {
      url: '/addGravatar',
      views: {
        'menuContent' : {
          templateUrl: 'views/addGravatar.html',
          controller: 'AddGravatarCtrl'
        }  
      }
      
    })
    .state('app.peoplemet', {
      url: '/peoplemet',
      views: {
        'menuContent' :{
          templateUrl: 'views/peoplemet.html',
          controller: 'AddPersonCtrl'

        }
      }
      
    })
    .state('app.sessions', {
      url: '/sessions',
      views: {
        'menuContent' :{
          templateUrl: 'views/sessions.html',
          controller: 'SessionsCtrl'
        }
      }
    })
    .state('app.singlesession', {
      url: '/sessions/:sessionID',
      views: {
        'menuContent':{
          templateUrl: 'views/singleSession.html',
          controller: 'SingleSessionCtrl'
        }
      }
    })
    .state('app.addPerson', {
      url: '/addPerson',
      views: {
        'menuContent':{
          templateUrl: 'views/addPerson.html',
          controller: 'AddPersonByEmailCtrl'
        }
      }
    })
    .state('app.my-schedule', {
      url: '/my-schedule',
      views: {
        'menuContent':{
          templateUrl: 'views/my-schedule.html'
        }
      }
    })
    .state('app.blog', {
      url: '/blog',
      views: {
        'menuContent':{
          templateUrl: 'views/blog.html',
          controller: 'BlogCtrl'
        }
      }
    })
    .state('app.singlepost', {
      url: '/blog/:postID',
      views: {
        'menuContent':{
          templateUrl: 'views/singlePost.html',
          controller: 'SinglePostCtrl'
        }
      }
    })
    .state('app.guides', {
      url: '/guides',
      views:{
        'menuContent':{
          templateUrl: 'views/guides.html',
          controller: 'GuidesCtrl'
        }
      }
    })
    .state('app.singleGuide', {
      url: '/guides/:id',
      views:{
        'menuContent':{
          templateUrl: 'views/singleGuide.html',
          controller: 'SingleGuideCtrl'
        }
      }
    })
    .state('help', {
      url: '/help',
      templateUrl: 'views/help.html'
    })
    ;
  $urlRouterProvider.otherwise('/app/start');
})
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})
.controller('FirstTimeCtrl', function($scope, $localStorage, $state, CFG){
  $scope.imgs = CFG.imgs;
  $scope.acceptTerms = function(){
    $localStorage.acceptedTerms = 'yes';
    $localStorage['wordcamp-people-met'] = [];
    $state.go('app.start');
  }
})
.controller('StartCtrl', function(CFG, API, $scope, $state, GravatarService, $http){
  $scope.getSponsors = function(){
    $scope.sponsors = CFG.sponsorsLogos
  }
  $scope.getSponsors();
})
.controller('AddGravatarCtrl', function($scope, $localStorage, $state, GravatarService){
  var gs = GravatarService;
  
  $scope.addGravatar = function(email){
    var email = email.toLowerCase();
    var hash = gs.getHash(email);
    console.log('hash', hash);
    gs.api.get({hash: hash+'.json'}, function(data){
      $localStorage.appOwner = data.entry[0];
      $state.go('app.start');
    });
  }
  
  $scope.deleteOwner = function(){
     $localStorage.appOwner = null;
     $state.go('app.start');
  }
})
.controller('SessionsCtrl', function($scope, API){
  var addTimestamp = function (element, index, array){
    var timestamp = element.post_meta[0].value;
    array[index].sessionTimestamp = timestamp;
  }
  $scope.sessions = API.query({type: 'wcb_session'}, function(data){
    data.forEach(addTimestamp);
  });
})
.controller('AppCtrl', function($scope, CFG, $state,  $localStorage, GravatarService){
  $scope.imgs = CFG.imgs;

  var gs = GravatarService;
  $scope.checkTerms = function(){
    var flag = $localStorage.acceptedTerms;
    if(flag == 'yes'){
      console.log('The terms have already been accepted');
    } else {
      $state.go('firstTime');
    }
  }
  $scope.checkTerms();
  

  $scope.checaOwner = function(){
    var ownerObj = $localStorage.appOwner || {};
    if(ownerObj.displayName){
      $scope.appOwner = ownerObj;
      $scope.avatar = ownerObj.photos[0].value;  
      return true
    }  else {
      return false
    }
  }  
  $scope.checaOwner();
})
.controller('BlogCtrl', function($scope, API){
    $scope.blog = API.query();
})

.controller('AddPersonCtrl', function($scope, $ionicPlatform, $localStorage, $http) {
$scope.people = $localStorage['wordcamp-people-met'];
$scope.addPerson = function(gravatarUrl) {
  $http.get(gravatarUrl+'.json')
    .then(function(data){
      var Person = data.data.entry[0];
      var newPerson = {
          id : Person.id
        , displayName:  Person.displayName
        , location: Person.currentLocation
        , image : Person.thumbnailUrl
        , email: Person.emails[0].value
      };
      $scope.people.unshift(newPerson);
    }, function(err){
      alert('Houve um erro ao adicionar: ', err);
    })
}
$scope.scanIt = function(){
  cordova.plugins.barcodeScanner.scan(
      function (result) {
          $scope.addPerson(result.text);
      }, 
      function (error) {
          alert("Houve um erro ao scanear o QRCode. \n Experimente adicionar por e-mail \n" + error);
      }
   );
}
$scope.deletePerson = function(personId){
  $scope.people.splice(personId, 1);
}
})
.controller('AddPersonByEmailCtrl', function($scope, GravatarService, $state, $http, $localStorage){
  var gs = GravatarService;
  $scope.addByEmail = function(email){
    var hash = gs.getHash(email);
    gs.api.get({hash: hash+'.json'}, function(response){
      var Person = response.entry[0];
      var newPerson = {
          id : Person.id
        , displayName:  Person.displayName
        , location: Person.currentLocation
        , image : Person.thumbnailUrl
        , email: Person.emails[0].value
      };
      $localStorage['wordcamp-people-met'].unshift(newPerson);
      $state.go('app.peoplemet');
    }, function(err){
      //error gravatar profile.
    })
  }
})
.controller('SingleSessionCtrl', function($scope, API, $stateParams){
  $scope.session = API.get({id: $stateParams.sessionID}, function(data){
    var timestamp = data.post_meta[0].value;
    $scope.session.sessionTimestamp = timestamp;
  });
})
.controller('SinglePostCtrl', function($scope, API, $stateParams){
  $scope.post = API.get({id: $stateParams.postID });//data.data;
})
.controller('GuidesCtrl', function($scope, API, CFG, $resource){
  $scope.guidesIndex = API.get({id: CFG.guides.guidesIndex});
  $scope.guides = [];
  CFG.guides.guides.forEach(function(data){
    $scope.guides.push(API.get({id: data}))
  })
})
.controller('SingleGuideCtrl', function($scope, API, CFG, $stateParams){
  $scope.guide = API.get({id: $stateParams.id})
})
;

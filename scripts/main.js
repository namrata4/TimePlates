/**
 * 
 */
var googAuth;
  
  var im,
  store,
  rootMirror,
  previous,
  associations,
  selectedAssociation

var authenticatedClient = null;
  
  var CLIENT_ID="74898333507-gjk0nqf1olseh5a23mjn7p9k2plrhs1u.apps.googleusercontent.com";
  var SCOPES = ['https://www.googleapis.com/auth/drive'];
  
  function authorize(){
	  gapi.load('auth2', function () {
          gapi.auth2.init({
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          })
          
          googAuth= gapi.auth2.getAuthInstance();
           })
           setTimeout(checkSignin, 1000);
  }
	  
function checkSignin(){
	console.log('Checking Auth')
    if (googAuth.isSignedIn.get()) {
      loadDriveAPI()
    } else {
      console.log('Attempting Sign In')
      // Need to have them sign in
      googAuth.signIn().then(function () {
		console.log('AUTH SUCCESS')
        loadDriveAPI()
      }, function (error) {
        // Failed to authenticate for some reason
		console.log('AUTH FAILED')
        googleAuth.reject(error)
      })
    }
	}
	
function loadDriveAPI(){
	
	 gapi.client.load('drive', 'v2', function () {
         // Once this callback is executed, that means we've authorized just as expected
         // and can therefore resolve the promise
         connectDrive()
       })
}

function connectDrive () {
    console.log('Attempting to connect')
    store = 'Google Drive'

    console.log('Successful Authentication!')
    authenticatedClient = gapi.client

    // Now we start dealing with item-mirror
   constructIMObject(store);
  }
  
function constructIMObject (store) {
	  im = new ItemMirror('Thisisastring', function (error, newMirror) {
	    if (error) {
	      console.log(error)
	    } else {
	      im = newMirror
	      // if(pathURI == "/") {
	      //     handleLastNavigated(newMirror)
	      // }
	      // Check to see which of the returned items is the correct store, and navigate into that mirror
	      if (store) {
	        associations = im.listAssociations()
	        for (var i = 0; i < associations.length; i++) {
	          var displayText = im.getAssociationDisplayText(associations[i])
	          if (displayText == store) {
	            navigateMirror(associations[i])
	           
	          }
	        }
	      } else {
	       refreshIMDisplay()
	        
	      }
	    }
	  })
	}

	// Attempts to navigate and display a new itemMirror association
	function navigateMirror (guid) {
	  im.createItemMirrorForAssociatedGroupingItem(guid, function (error, newMirror) {
	    if (!error) {
	      im = newMirror
	      refreshIMDisplay()
	    } else {
	      console.log(error)
	    }
	  })
	}
	function refreshIMDisplay () {
		/* var div= document.getElementById("authorize-div");
		div.style.display="none"; */
		  associations = im.listAssociations()
		  var length = associations.length

		  // Grab associations and organize them by type
		  var groupingItems = []
		  var nonGroupingItems = []
		  for (var i = 0; i < length; i++) {
		    if (im.isAssociationAssociatedItemGrouping(associations[i])) {
		      groupingItems.push(associations[i])
		    } else {
		      nonGroupingItems.push(associations[i])
		    }
		  }

		// printAssociations(im.listAssociations())
	//	printGroupingItems(im);
		
		 
		}
  
  
  
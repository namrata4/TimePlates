/**
 * 
 */
var googAuth;
  
  var im,
  rootim,
  store,
  previous,
  associations,
  selectedAssociation

var authenticatedClient = null;
  
  var CLIENT_ID="74898333507-gjk0nqf1olseh5a23mjn7p9k2plrhs1u.apps.googleusercontent.com";
  var SCOPES = ['https://www.googleapis.com/auth/drive'];
  
  function authorize(){
	  
		document.getElementById("storeSelect").style.display="none";
	  
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
	var ret;
    if (googAuth.isSignedIn.get()) {
      loadDriveAPI()
     // createBaseFolderStructure();
    } else {
      console.log('Attempting Sign In')
      // Need to have them sign in
      googAuth.signIn().then(function () {
		console.log('AUTH SUCCESS')
        loadDriveAPI()
      //  createBaseFolderStructure();
      }, function (error) {
        // Failed to authenticate for some reason
		console.log('AUTH FAILED')
        googleAuth.reject(error)
       
      })
    }
    return ret;
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
	debugger;
	  im = new ItemMirror('Thisisastring', function (error, newMirror) {
	    if (error) {
	      console.log(error)
	    } else {
	      im = newMirror;
	      rootim=newMirror;
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
	           rootim=im;
	          }
	        }
	      } else {
	       refreshIMDisplay()
	        
	      }
	    
	    }
	  })
	  
	}

	// Attempts to navigate and display a new itemMirror association
function navigateMirror(guid) {
	im.createItemMirrorForAssociatedGroupingItem(guid, function(error, newMirror) {

		if(!error) {
			im = newMirror;
			  createBaseFolderStructure();

      if(!rootim) {
    	  rootim = im; // Save root to be used for home button and root fragment saving
      }

      refreshIMDisplay();
		} else {
			console.log(error);
		}
	});

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
	
	function createBaseFolderStructure(){
		debugger;
		var options= [
		              {
		 "displayText":"Trip1",
		"localItem":"TimePlates",
		"isGroupingItem":"true"}];
		
		var days=3;
		var tripim;
		im.createAssociation(options[0], function(error,GUID){
			if(!error)
				{
				im.createItemMirrorForAssociatedGroupingItem(GUID, function (error, newMirror) {
				    if (!error) {
				    	tripim = newMirror
				    } else {
				      console.log(error);
				      alert("Error in creating Folders, Please try connecting again.");
						document.getElementById("mainDiv").style.display="none";
						document.getElementById("storeSelect").style.display="block";
				    }
				  })
				}
			else{
				alert("Error in creating Folders, Please try connecting again.");
				document.getElementById("mainDiv").style.display="none";
				document.getElementById("storeSelect").style.display="block";
				
			}
			
		});
		
		
		
	
		document.getElementById("mainDiv").style.display="block";
		
	}
  
  
  
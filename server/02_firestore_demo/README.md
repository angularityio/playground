# firestore_demo

<script src="https://www.gstatic.com/firebasejs/4.7.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBBHfUxdpg14I-pwx0VmCgH_WfTpX7cqMk",
    authDomain: "ay-rest-demo.firebaseapp.com",
    databaseURL: "https://ay-rest-demo.firebaseio.com",
    projectId: "ay-rest-demo",
    storageBucket: "ay-rest-demo.appspot.com",
    messagingSenderId: "609029776456"
  };
  firebase.initializeApp(config);
</script>

https://stackoverflow.com/questions/46762667/firebase-firestore-rest-example

curl -X POST \
-H "Content-Type: application/json" \
-d'{
"fields": {
"Field1": {
"stringValue": "'"$var1"'"
},
"Field2": {
"stringValue": "'"$var2"'"
},
"Field3": {
"stringValue": "$var3"
}
}
}'\"https://firestore.googleapis.com/v1beta1/projects/ay-rest-demo/databases/(default)/documents/hmQbTpLBatGy95tktwSK?&key=AIzaSyBBHfUxdpg14I-pwx0VmCgH_WfTpX7cqMk"



https://console.firebase.google.com/project/ay-rest-demo/database/firestore/data/posts/hmQbTpLBatGy95tktwSK

https://github.com/firebase/quickstart-js/tree/master/firestore

https://firebase.google.com/docs/firestore/use-rest-api
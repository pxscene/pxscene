function downloadArtifact()
{
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://ci.appveyor.com/api/projects/pxscene/pxcore/history?recordsNumber=50", false); 
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var history = JSON.parse(xhttp.responseText);
  var result = "";
  for (var build in history.builds) {
    //alert(history.builds[build].pullRequestId);
    if (history.builds[build].pullRequestId == undefined ){
      var xhttp1;
      xhttp1 = new XMLHttpRequest();
      xhttp1.open("GET", "https://ci.appveyor.com/api/projects/pxscene/pxcore/build/"+history.builds[build].version, false);
      xhttp1.setRequestHeader("Content-type", "application/json");
      xhttp1.send();
      
      var result = JSON.parse(xhttp1.responseText);
      if (result.build.jobs[0].artifactsCount > 0){
        //alert("version : " +history.builds[build].version);
        var downloadFile = "https://ci.appveyor.com/api/buildjobs/"+result.build.jobs[0].jobId+"/artifacts/pxscene-setup.exe"
        window.open(downloadFile);
        return;
      }   
    } 
  }
}

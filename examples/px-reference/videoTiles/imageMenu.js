px.import({scene:"px:scene.1.js",ImageRow:"imageRow.js"}).then( function ready(imports) {
  
  var ImageRow = imports.ImageRow;
  var scene = imports.scene;
  
  var imageRowContainer = scene.create({t:"object",parent:scene.root,w:1000, h:720});

  var rows = {};
  var rowsY = {};

  var imageUrls = ["http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/77/485/ScoobyDooFrankencreepy-Poster_1407946075576_180_240.jpg",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/78/1019/1451405014535_19714777300__820410.jpg",
                  "http://legacy.myriad-next.comcast.net/select/image?entityId=6026822788874293112&width=240&height=320",
                  "http://legacy.myriad-next.comcast.net/select/image?entityId=6312249158073517112&width=240&height=320",
                  "http://legacy.myriad-next.comcast.net/select/image?entityId=7333722833227402112&width=240&height=320",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/80/317/1453577380599_19808677300__348594.jpg",
              ];
  var imageUrls3 = ["http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/77/923/1449591219567_19679219300__253598.jpg",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/74/896/1445357055322_19595742300__348050.jpg",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/79/112/1451579859434_19719920300__631333.jpg",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/54/964/1427393377859_18316985300__323610.jpg",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/78/671/1450800442511_19703067300__044844.jpg",
                  "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/78/1019/1451405039252_19714907300__845899.jpg",
              ];              
  var imageUrls2 = ["http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/81/109/Downton_Mercy_2-1_1454335458572_360_240.jpg",
                    "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/79/927/Angie_Tribeca_1-18_1453070969519_270_180.jpg",
                    "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/81/218/OJ_Simpson_2-3_1454449812526_270_180.jpg",
                    "http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/81/151/X-Files_2-2_1454419717051_270_180.jpg",
               ];
               
  // Load json file that points to a bunch of images
  var jsonUrls;
  var numUsedJsonUrls270x180 = 0;
  var numUsedJsonUrls180x240 = 0;
  var manyImageUrlsFile = scene.loadArchive("http://xre2-apps.cvs-a.ula.comcast.net/cfry002/tilesProto/images.json");  
  manyImageUrlsFile.ready.then(function(f) 
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>In promise from images.json<<<<<<<<<<<<<<<");
    manyImageUrls = manyImageUrlsFile.getFileAsString("http://xre2-apps.cvs-a.ula.comcast.net/cfry002/tilesProto/images.json");
    console.log("manyImageUrls "+manyImageUrls);
    jsonUrls = JSON.parse(manyImageUrls);
  });

  var rowFocusIndex = 0;
  var numImageRows = 3;
  var imageRowsStartY = 200;
  var y = imageRowsStartY;
  rows[0] = new ImageRow(imageRowContainer, 30, y, 1000, 475, imageUrls2,340,240);
  rowsY[0] = y;
  y += 300;  
  rows[1] = new ImageRow(imageRowContainer, 30, y, 1000, 475, imageUrls);
  rowsY[1] = y;
  y += 300;
  rows[2] = new ImageRow(imageRowContainer, 30, y, 1000, 475, imageUrls3);
  rowsY[2] = y;
  y += 300;  
  //for(var i = 0; i < numImageRows; i++)
  //{
    //if( i == 0) 
    //{
      //rows[i] = new ImageRow(imageRowContainer, 30, y, 1000, 475, imageUrls2,340,240);
    //}
    //else 
    //{
      //rows[i] = new ImageRow(imageRowContainer, 30, y, 1000, 475, imageUrls);
    //}
    //rowsY[i] = y;
    //y += 300;
    
  //}
  
  /** ******************************************************************
   * These loadMoreImages functions are hacks until there is some type
   * of real json feed to use!
   * ******************************************************************/
  var numberedImagesVal = 1;
  /** loadMoreImages : load images by numbered names from http://54.146.54.142/images/ */
  var loadMoreImages = function()
  {
    console.log("LOAD MORE IMAGES");
    // load a new set of 6 images
    imageUrls = [];
    var tmp = numberedImagesVal +5;
    for(var i  = 0; i< 6 && numberedImagesVal<=209; i++)
    {
      imageUrls[i] = "http://54.146.54.142/images/dvd_tile."+numberedImagesVal+".jpg";
      console.log("imageUrl for i="+i+" is "+imageUrls[i]);
      numberedImagesVal++;
    }
    console.log("image rows are "+numImageRows);
    rowsY[numImageRows] = imageRowsStartY;
    console.log("imageRowContainer "+imageRowContainer.description);
    console.log("imageUrls.length is "+imageUrls.length);
    rowsY[numImageRows] = rowsY[numImageRows-1]+300;
    rows[numImageRows] = new ImageRow(imageRowContainer, 30, rowsY[numImageRows], 1000, 475, imageUrls);

    numImageRows++;
    console.log("image rows are "+numImageRows);
  }
  /** loadMoreJsonImages270x180 : Load 270x180 images from json file */
  var loadMoreJsonImages270x180  = function()
  {
    console.log("LOAD MORE JSON IMAGES");
    // load a new set of 6 images
    imageUrls = [];
//    var tmp = numberedImagesVal +5;
    for(var i  = 0; i< 6 && numUsedJsonUrls270x180<jsonUrls.images.size270x180.length; i++)
    {
      imageUrls[i] = jsonUrls.images.size270x180[numUsedJsonUrls270x180];
      console.log("imageUrl for i="+i+" is "+imageUrls[i]);
      numUsedJsonUrls270x180++;
    }
    console.log("image rows are "+numImageRows);
    console.log("numUsedJsonUrls="+numUsedJsonUrls270x180);
    rowsY[numImageRows] = imageRowsStartY;
    console.log("imageRowContainer "+imageRowContainer.description);
    console.log("imageUrls.length is "+imageUrls.length);
    rowsY[numImageRows] = rowsY[numImageRows-1]+300;
    rows[numImageRows] = new ImageRow(imageRowContainer, 30, rowsY[numImageRows], 1000, 475, imageUrls,270,180);

    numImageRows++;
    console.log("image rows are "+numImageRows);
  }
  /** loadMoreJsonImages180x240 : Load 180x240 images from json file */
  var loadMoreJsonImages180x240  = function()
  {
    console.log("LOAD MORE JSON IMAGES");
    // load a new set of 6 images
    imageUrls = [];
    for(var i  = 0; i< 6 && numUsedJsonUrls180x240<jsonUrls.images.size180x240.length; i++)
    {
      imageUrls[i] = jsonUrls.images.size180x240[numUsedJsonUrls180x240];
      console.log("imageUrl for i="+i+" is "+imageUrls[i]);
      numUsedJsonUrls180x240++;
    }
    console.log("image rows are "+numImageRows);
    console.log("numUsedJsonUrls="+numUsedJsonUrls180x240);
    rowsY[numImageRows] = imageRowsStartY;
    console.log("imageRowContainer "+imageRowContainer.description);
    console.log("imageUrls.length is "+imageUrls.length);
    rowsY[numImageRows] = rowsY[numImageRows-1]+300;
    rows[numImageRows] = new ImageRow(imageRowContainer, 30, rowsY[numImageRows], 1000, 475, imageUrls);

    numImageRows++;
    console.log("image rows are "+numImageRows);
  }
  
  /** imageRowContainer onKeyDown */
  imageRowContainer.on("onKeyDown", function(e) 
  {
    if (e.keyCode == 40) // down arrow
    { 
      if( rowFocusIndex+2 >= numImageRows)
      {  
        if( numberedImagesVal < 209) 
          loadMoreImages();
        else 
        {
          // Load additional images from the images.json file!
          if(numUsedJsonUrls270x180 < jsonUrls.images.size270x180.length) 
          {
            loadMoreJsonImages270x180();
          } 
          else if(numUsedJsonUrls180x240 < jsonUrls.images.size180x240.length) 
          {
            loadMoreJsonImages180x240();
          } 
          else if( rowFocusIndex >= numImageRows-1)
          {
            rowFocusIndex = numImageRows-1;
            return;
          }
        }
      }
      //e.stopPropagation();
      rowFocusIndex++;
      rows[rowFocusIndex].setFocus(); 
      for(var i = 0; i < numImageRows; i++)
      {
        rowsY[i] -= 300;
        rows[i].animateTo(30,rowsY[i]);
      }


    } 
    else if(e.keyCode == 38) { // up arrow
      if( rowFocusIndex <= 0){
        rowFocusIndex = 0;
        return;
      }
      //e.stopPropagation();
      rowFocusIndex--;
      rows[rowFocusIndex].setFocus();
      for(var i = numImageRows-1; i >=0 ; i--)
      {
        rowsY[i] += 300;
        rows[i].animateTo(30,rowsY[i]);
      }
    
    }
    else if(e.keyCode == 39) // right arrow
    {
      console.log("imageMenu got right arrow");
    }
    else if(e.keyCode == 37) // left arrow 
    {
      console.log("imageMenu got left arrow");
    }
    
  }); // End onKeyDown
  
  /** imageRowContainer onMouseDown */
  imageRowContainer.on("onMouseDown", function (e) {
    console.log("imageRowContainer onMouseDown");
    // !TODO: Need a good way to check if already focused!
    e.stopPropagation();
//    rows[rowFocusIndex].setFocus(); 
  });
  
  rows[rowFocusIndex].setFocus();
  
}).catch(function importFailed(err){
  console.log("Import failed for imageMenu.js: " + err);
});

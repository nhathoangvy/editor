(function($){
var originalDir = $('.pth').text();
        var extensionsMap = {
                      ".zip" : "fa-file-archive-o",
                      ".gz" : "fa-file-archive-o",
                      ".bz2" : "fa-file-archive-o",
                      ".xz" : "fa-file-archive-o",
                      ".rar" : "fa-file-archive-o",
                      ".tar" : "fa-file-archive-o",
                      ".tgz" : "fa-file-archive-o",
                      ".tbz2" : "fa-file-archive-o",
                      ".z" : "fa-file-archive-o",
                      ".7z" : "fa-file-archive-o",
                      ".mp3" : "fa-file-audio-o",
                      ".cs" : "fa-file-code-o",
                      ".c++" : "fa-file-code-o",
                      ".cpp" : "fa-file-code-o",
                      ".js" : "fa-file-code-o",
                      ".xls" : "fa-file-excel-o",
                      ".xlsx" : "fa-file-excel-o",
                      ".png" : "fa-file-image-o",
                      ".jpg" : "fa-file-image-o",
                      ".jpeg" : "fa-file-image-o",
                      ".gif" : "fa-file-image-o",
                      ".mpeg" : "fa-file-movie-o",
                      ".pdf" : "fa-file-pdf-o",
                      ".ppt" : "fa-file-powerpoint-o",
                      ".pptx" : "fa-file-powerpoint-o",
                      ".txt" : "fa-file-text-o",
                      ".log" : "fa-file-text-o",
                      ".doc" : "fa-file-word-o",
                      ".docx" : "fa-file-word-o",
                    };

  function getFileIcon(ext) {
    return ( ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
  }

   var currentPath = null;
   var options = {
        "bProcessing": true,
        "bServerSide": false,
        "bPaginate": false,
        "bAutoWidth": false,
         "sScrollY":"250px",
        "fnCreatedRow" :  function( nRow, aData, iDataIndex ) {
          if (!aData.IsDirectory) return;
          var path = aData.Path;
          $(nRow).bind("click", function(e){
             $.get('/dir?path='+ path).then(function(data){
              table.fnClearTable();
              table.fnAddData(data);
              currentPath = path;
              var bc = currentPath;
              $('.dir').val(bc);
              $('.bc').html('<span style="color:#d8d8d8">' + originalDir + '</span>/' + bc);
            });
            e.preventDefault();
          });

        },
        "aoColumns": [
          { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "55px",
            "render": function (data, type, row, meta) {
              if (data.IsDirectory) {
                return "<input type='checkbox' value='" + originalDir + '/' + data.Path + "'/><strong>  </strong><a class='fold href' href='#'><i class='fa fa-folder'></i>&nbsp;" + data.Name +"</a><span style='margin-left:7px;display:inline-block;' class='fa fa-sort-down'></span><b style='font-weight:500;display:none;margin-left:10px;font-size:12px' class='b'>X</b><form action='/renameFile' class='rename ajax' target='p' style='display:none' method='get'><input type='hidden' name='file' value='" + data.Name + "'/><input type='hidden' value='" + originalDir + "' name='base'/><input type='hidden' class='dest' name='dir'/> <input type='text' name='change'/><input type='submit' value='Rename' /></form>";
              } else {
                return "<input type='checkbox' value= '" + originalDir + '/' + data.Path + "'/> <a class='href fileName' href='#' target='p'><i class='fa " + getFileIcon(data.Ext) + "'></i>&nbsp;<span class='name'>" + data.Name +  "</span></a><span style='margin-left:7px;display:inline-block;' class='fa fa-sort-down'></span><b style='font-weight:500;display:none;margin-left:10px;font-size:12px' class='b'>X</b><form action='/renameFile' style='display:none' target='p' class='rename ajax' method='get'><input type='hidden' name='file' value='" + data.Name + "'/><input type='hidden' value='" + originalDir + "' name='base'/><input type='hidden' class='dest' name='dir'/> <input type='text' name='change'/><input type='submit' value='Rename' /></form>";

              }
            }
          }
        ]
   };

  var table = $(".linksholder").dataTable(options);
  var str = $('.pth').text();
  if(str.length > 0){
    $.get('/dir').then(function(data){
        table.fnClearTable();
        table.fnAddData(data);
    });
  }

  //Base dir
  $(".home").bind("click", function(e){
    var path = '';
    $.get('/dir?path='+ path).then(function(data){
        table.fnClearTable();
        table.fnAddData(data);
          var bc = path;
        $('.dir').val(bc);
        $('.bc').html('<span style="color:#d8d8d8">' + originalDir + '</span>/' + bc);
    });
  });

  $("#upload").click(function(){
           $('#upload').change(function() {
          $('.accept').click();
      });
  });
    setInterval(function(){
      $('.fileName').map(function(){
      $(this).click(function(e){
      var name = $(this).find('.name').text();
      var tmp = $('.dir').val();
      if(tmp.length > 0){
        $.get('/files?path=' + tmp).then(function(desk){
          for(var i = 0 ; i < desk.length ; i++){
            if(desk[i].Name === name){
              $('.path').val(originalDir + '/' + tmp + '/' + desk[i].Name);
              $('.test').val(desk[i].detail);
            }
          }
            });
      }else{
              $.get('/files').then(function(desk){
                for(var i = 0 ; i < desk.length ; i++){
                  if(desk[i].Name === name){
                    $('.path').val(originalDir + '/' + desk[i].Name);
                    $('.test').val(desk[i].detail);
                  }
                }
                  });
            }
        });
      });
      //Upon.replace(/[^a-z0-9\s]/gi, '/')
      $(".up").bind("click", function(e){
        var ps = $('.dir').val();
        var temp = ps;
        var idx = temp.lastIndexOf("/");
        var path = temp.substr(0, idx);
        $.get('/dir?path='+ path).then(function(data){
            table.fnClearTable();
            table.fnAddData(data);
              var bc = path;
            $('.dir').val(bc);
            $('.bc').html('<span style="color:#d8d8d8">' + originalDir + '</span>/' + bc);
        });
      });
      //currentPath
      $('.ajax').map(function(){
      $(this).submit(function(e){
        var cur = $('.dir').val();
         $.get('/dir?path=' + cur).then(function(data){
          table.fnClearTable();
          table.fnAddData(data);
          });
        });
      });
      $("#upload").click(function(){
               $('#upload').change(function() {
          var cur = $('.dir').val();
           $.get('/dir?path=' + cur).then(function(data){
            table.fnClearTable();
            table.fnAddData(data);
            });
          });
        });
      //breadcrumbs
  /*    $('a.bc').map(function(){
      $(this).bind("click", function(e){
        $(this).attr('href');
         $.get('/files?path='+ path).then(function(data){
           table.fnClearTable();
            table.fnAddData(data);
            });
          e.preventDefault();
        });
      });
      */

          if($('input[type=checkbox]').is(':checked')){
            $('.remove').removeClass('not-allow');
          }else {
            $('.remove').addClass('not-allow');
          };

$('input[type=checkbox], .rename, .fa-sort-down').click(function(e){
   e.stopPropagation();
});
      $('.del').val(
          $('input[type=checkbox]:checked').map(function() {
              return $(this).val();
          }).toArray().join(", ")
      );
      $('.move').val(
          $('input[type=checkbox]:checked').map(function() {
              return $(this).closest("td").find('input[name="file"]').val();
          }).toArray().join(", ")
      );
      $('.b').each(function(){
        $(this).click(function(){
            $('.rename').hide();
              $(this).hide();
               e.stopPropagation();
          });
        });
        $('a.fold').click(function(){
          $('.pth').text('');
        });
          $('a.href').map(function(){
              var mdF = $(this).attr('href');
              var md = $('.dir').val();
              $(this).closest('td').find('.dest').val(md);
            $(this).closest('td').find('span').click(function(e) {
              $('.rename').hide();
              $(this).closest('td').find('form').show();
              $(this).closest('td').find('b').show();

            });
          /*      $(this).click(function(e){
                  $.get(mdF).then(function(item){

                    if(item === 'undefined'){
                      $('.test').val('');
                      }else{
                        $('.test').val('');
                          $('.test').val(item);
                      }
                      $('.path').val(mdF);

                    });
                  }); */
                });



                //resizeable
                 $( ".panel-heading, .panel-body, .resize, .view" ).resizable();


              }, 200);


              //binding templates
              $('#click').click(function(){
                $('.marktext').val($('#markdown').html());
              });
              var delay = (function(){
              var timer = 0;
              return function(callback, ms){
                clearTimeout (timer);
                timer = setTimeout(callback, ms);
              };
            })();
              $('.test').keyup(function() {
                delay(function(){
                  $('#click').click();
                }, 1500 );
            });

//icon button

$('.add').map(function(){
  $(this).click(function(){
      $(this).closest('.set').find('form').slideToggle();
  });
});

//iframe media
$('#desktop').click(function(){
  $('.view iframe').animate({
    'width':"100%"
  }, 500);
  $('#desktop').addClass('selected');
  $('#tablet, #phone').removeClass('selected');
});

$('#tablet').click(function(){
  $('.view iframe').animate({
    'width':"66.666%"
  }, 500);
  $('#tablet').addClass('selected');
  $('#desktop, #phone').removeClass('selected');
});

$('#phone').click(function(){
  $('.view iframe').animate({
    'width':"33.333%"
  }, 500);
  $('#phone').addClass('selected');
  $('#tablet, #desktop').removeClass('selected');
});

//scroll iframe
var delay = (function(){
 var timer = 0;
 return function(callback, ms){
   clearTimeout (timer);
   timer = setTimeout(callback, ms);
 };
})();
    $('.test').focus(function() {
          var content = $(this).val();
          $(this).val(content + '<a name="here"></a>');
          $('#click').click();
            $(this).val(content);
      });
//editor
$(".test").markdown({autofocus:false,savable:false});
            })(jQuery);

var defaultColors = [];

$(function() {
  // This will select everything with the class smoothScroll
  // This should prevent problems with carousel, scrollspy, etc...
  $('.smoothScroll').click(function(e) {
  	e.preventDefault();
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {

      	$('html,body').on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
       $('html,body').stop();
    });

        $('html,body').animate({
          scrollTop: target.offset().top-80
        }, 700, function() {
          /* ADDED: focus the target */
          //clearSelection();

          target.focus();
          /* end ADDED */
          /* ADDED: update the URL */
          //window.location.hash = $linkElem.attr('href').substring(1);
         // window.location.hash = $(this).attr('href').substring(1, $(this).attr('href').length);
          /* end ADDED */
        }); // The number here represents the speed of the scroll in milliseconds
        return true;
      }
    }
  });

  $('.jscolor').each(function()
  {
    var variableName = $(this).data('variable_name');
    var defaultColor = getComputedStyle(document.documentElement).getPropertyValue(variableName);

    defaultColors[variableName] = defaultColor;
    this.jscolor.fromString(defaultColor);

    this.jscolor.onFineChange = function()
    {
      document.documentElement.style.setProperty(variableName, "#" + this);
    }
  });

  $('#resetColors').click(function()
  {
    $('.jscolor').each(function()
    {
      var variableName = $(this).data('variable_name');
      this.jscolor.fromString(defaultColors[variableName]);
      this.jscolor.onFineChange();
    });
  });

  var offsetTop = $('#Skills').offset().top;
  $(window).scroll(function() {
  var height = $(window).height();
  if($(window).scrollTop()+height > offsetTop) {
    jQuery('.skillbar').each(function(){
      jQuery(this).find('.skillbar-bar').animate({
        width:jQuery(this).attr('data-percent')
      },2000);
    });
  }
  });
});

$(function(){ 
     var navMain = $(".navbar-collapse"); // avoid dependency on #id
     // "a:not([data-toggle])" - to avoid issues caused
     // when you have dropdown inside navbar
     navMain.on("click", "a:not([data-toggle])", null, function () {
         navMain.collapse('hide');
     });
 });

// Stop video when closing modal!
$(document).ready(function()
{

  LoadProjects();

  $('#theModal').on('hidden.bs.modal', function ()
  {
    callPlayer('ytplayer', 'pauseVideo');
  });

})

  function LoadProjectModal(project)
  {
    var modal = $('#theModal');
    if (modal.data('project') == project)
      return;

    $.getJSON( "./projects/project_data.json", function(data)
    {
      modal.data('project', project);
      if (data['Projects'][project] == undefined)
      {
        modal.find('.modal-content').load('./404.html #notfound');
        return;
      }

      modal.find('.modal-content').load("./projects/project_modal.html", function()
      {
        $('#ProjectTitle').html(data['Projects'][project]['Name']);
        var iframeSrc = "https://www.youtube.com/embed/" + data['Projects'][project]['VideoId'] + "?enablejsapi=1&loop=1&modestbranding=1&iv_load_policy=3&rel=0";
        $('#ytplayer').attr('src', iframeSrc);
        $('#SmallText1').html(data['Projects'][project]['SmallText1']);
        $('#SmallText2').html(data['Projects'][project]['SmallText2']);
        $('#SmallText3').html(data['Projects'][project]['SmallText3']);
      });
    });
  };

function LoadProjects()
{
  // <div class="col-lg-4 col-md-6 col-sm-12">
  //           <div class="thumbnail project">
  //             <a href="" data-toggle="modal" data-target="#theModal" data-project="VertigoRush"><img class="img-fluid projectPicture" src="assets/projects/Vertigo.jpg"></a>
  //           </div>
  //         </div>

  $.getJSON( "./projects/project_data.json", function(data)
  {
    $.each(data['Projects'], function(projectName, project)
    {
      var columnDiv = $(document.createElement('div'));
      columnDiv.addClass('col-lg-4 col-md-6 col-sm-12');

      var thumbnailDiv = $(document.createElement('div'));
      thumbnailDiv.addClass('thumbnail project');

      var openModal = $(document.createElement('a'));
      openModal.attr('href', '');

      openModal.click(function(e)
      {
        e.preventDefault();
        $('#theModal').modal('toggle');

        LoadProjectModal(projectName);
      })

      openModal.append('<img class="img-fluid projectPicture" src="assets/projects/' + project['Thumbnail'] + '">');

      thumbnailDiv.append(openModal);
      columnDiv.append(thumbnailDiv);

      columnDiv.appendTo('#projectPictures');
    });
  });
}

function callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }

    // When the player is not ready yet, add the event to a queue
    // Each frame_id is associated with an own queue.
    // Each queue has three possible states:
    //  undefined = uninitialised / array = queue / .ready=true = ready
    if (!callPlayer.queue) callPlayer.queue = {};
    var queue = callPlayer.queue[frame_id],
        domReady = document.readyState == 'complete';

    if (domReady && !iframe) {
        // DOM is ready and iframe does not exist. Log a message
        window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
        if (queue) clearInterval(queue.poller);
    } else if (func === 'listening') {
        // Sending the "listener" message to the frame, to request status updates
        if (iframe && iframe.contentWindow) {
            func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
            iframe.contentWindow.postMessage(func, '*');
        }
    } else if ((!queue || !queue.ready) && (
               !domReady ||
               iframe && !iframe.contentWindow ||
               typeof func === 'function')) {
        if (!queue) queue = callPlayer.queue[frame_id] = [];
        queue.push([func, args]);
        if (!('poller' in queue)) {
            // keep polling until the document and frame is ready
            queue.poller = setInterval(function() {
                callPlayer(frame_id, 'listening');
            }, 250);
            // Add a global "message" event listener, to catch status updates:
            messageEvent(1, function runOnceReady(e) {
                if (!iframe) {
                    iframe = document.getElementById(frame_id);
                    if (!iframe) return;
                    if (iframe.tagName.toUpperCase() != 'IFRAME') {
                        iframe = iframe.getElementsByTagName('iframe')[0];
                        if (!iframe) return;
                    }
                }
                if (e.source === iframe.contentWindow) {
                    // Assume that the player is ready if we receive a
                    // message from the iframe
                    clearInterval(queue.poller);
                    queue.ready = true;
                    messageEvent(0, runOnceReady);
                    // .. and release the queue:
                    while (tmp = queue.shift()) {
                        callPlayer(frame_id, tmp[0], tmp[1]);
                    }
                }
            }, false);
        }
    } else if (iframe && iframe.contentWindow) {
        // When a function is supplied, just call it (like "onYouTubePlayerReady")
        if (func.call) return func();
        // Frame exists, send message
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
    /* IE8 does not support addEventListener... */
    function messageEvent(add, listener) {
        var w3 = add ? window.addEventListener : window.removeEventListener;
        w3 ?
            w3('message', listener, !1)
        :
            (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
    }
}
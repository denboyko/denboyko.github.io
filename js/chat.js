//© All rights reserved. BotsCrew 2017
$(document).ready(function () {

    window.fbAsyncInit = function () {
        FB.init({
            appId: 1975921582622675,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.10'
        });
        FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    (function () {
        var root = './';
        var navHeight = 82,
            genericScrollValue;

        function init() {
            var $ = window.jQuery;

            var anchor = $('#chat-container');

            var ua = navigator.userAgent;
            var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
            var Android = !!ua.match(/Android/i);
            var Mobile = !!ua.match(/Mobi/i);
            var Mac = !!ua.match(/Macintosh/i);

            var $w = $(window);
            var chatWindow = $('#chat-window');

            var messageContainer = $('<div class="message-container">')
                .attr('id', 'messageContainer')
                .css('width', '100%')
                .css('height', '100%')
                .css('background-size', '100%')
                .appendTo(chatWindow);


            $('<div class="start-screen">')
                .append(
                    $('<div class="inner">')
                        .append(
                            $('<p class="description">')
                                .text("To continue chat to Ailira, please login")
                                // .text("To continue chat to Ailira, please login using one of the social networks below")
                        )
                        .append(
                            $('<a class="login-btn fb">')
                                .append(
                                    $('<span class="logo">').text('f')
                                )
                                .append(
                                    $('<span class="text">').text('Login with Facebook')
                                )
                                .on("click", loginFB)
                        )
                        // .append(
                        //     $('<a class="login-btn goo">')
                        //         .append(
                        //             $('<span class="logo">').text('G')
                        //         )
                        //         .append(
                        //             $('<span class="text">').text('Login with Google')
                        //         )
                        // )
                )
                .appendTo(chatWindow);


            $('<div class="chat-bottom">')
                .css('height', '58px')
                .append(
                    $('<div class="input-container">')
                        .append(
                            $('<input type="text" placeholder="Type your message ...">')
                                .attr('id', 'chatInput')
                                .addClass('black-placeholder')
                                .keypress(function (event) {
                                    if (event.which === 13) {
                                        event.preventDefault();
                                        send();
                                    }
                                })
                                .css('width', 'calc(100% - 88px)')
                        )
                        .append(
                            $('<a class="send-message">').text('Send')
                                .css('float', 'right')
                                .css('border-bottom', 'none')
                                .click(send)
                            // .click(sendName)
                        )
                )
                .appendTo(chatWindow);


            $('<div class="message-outer bot">')
                .css('visibility', 'hidden')
                .css('margin-bottom', '0')
                .append(
                    $('<div class="chat-message bot purple">').text("I'm hidden:)")
                )
                .prependTo(chatWindow.find('.message-container'));

            chatWindowShow();

            function chatWindowShow() {
                chatWindow.show().addClass('expanded no-border');
                $("#chatInput").val('');
            }

            function setResponse(val) {

                var typing = $('.message-container').find($('#wave'));

                if (typing) {
                    typing.parent().parent().remove();
                }

                var sendBtn = $('.send-message');
                var container = $('<div class="message-outer bot">');
                var message = $('<div class="chat-message bot">');
                var btnWidth,
                    scrCont,
                    scrContWidth = 0;

                if (val.sender_action) {
                    console.log('TYPING');
                    var wave = $('<div id="wave">')
                        .append($('<span class="dot">'))
                        .append($('<span class="dot">'))
                        .append($('<span class="dot">'));
                    container.append(
                        $('<div class="message-row">')
                            .append(wave)
                    );
                }

                if ((val.message !== null) && (val.message !== undefined)) {
                    if (val.message.text !== undefined) {
                        message.text(val.message.text);
                        sendName(val.message.text, "", true);
                    } else if (val.message.attachment !== undefined) {
                        message.text(val.message.attachment.payload.text);
                    }


                    setTimeout(function () {

                        if (message.text().length && message.text().trim()) {
                            $('<div class="message-row">')
                                .append(
                                    message
                                )
                                .appendTo(container);
                        }

                        if (val.message.quick_replies) {
                            scrCont = $('<div>')
                                .addClass('scrolling-container')
                                .addClass('quick')
                                .append(
                                    $('<span class="arrow">')
                                        .text('<')
                                        .click(
                                            function () {
                                                var navwidth = scrCont.find('ul');
                                                navwidth.scrollLeft(navwidth.scrollLeft() - 200);
                                            }
                                        )
                                )
                                .append(
                                    $('<span class="arrow">')
                                        .text('>')
                                        .click(
                                            function () {
                                                var navwidth = scrCont.find('ul');
                                                navwidth.scrollLeft(navwidth.scrollLeft() + 200);
                                            }
                                        )
                                )
                                .append(
                                    $('<ul>')
                                )
                                .appendTo(container);

                            val.message.quick_replies.forEach(function (item) {
                                $('<li>')
                                    .text(item.title)
                                    .attr('payload', item.payload)
                                    .click(function () {
                                        send("btn", $(this))
                                    })
                                    .appendTo(scrCont.find('ul'));
                            });

                            scrCont.find('ul').find('li').each(function () {
                                scrContWidth += parseInt($(this).css('width'), 10) + 10;
                            });

                            if (scrContWidth > parseInt(scrCont.css('width'), 10)) {
                                scrCont.addClass('scrollable');
                                console.log(scrContWidth > parseInt(scrCont.css('width'), 10));
                                console.log(parseInt(scrCont.css('width'), 10));

                            }
                        }

                        if (val.message.attachment && val.message.attachment.payload.elements) {
                            scrCont = $('<div>')
                                .addClass('scrolling-container')
                                .append(
                                    $('<span class="arrow">')
                                        .text('<')
                                        .click(
                                            function () {
                                                var navwidth = scrCont.find('ul');
                                                navwidth.scrollLeft(navwidth.scrollLeft() - 200);
                                            }
                                        )
                                )
                                .append(
                                    $('<span class="arrow">')
                                        .text('>')
                                        .click(
                                            function () {
                                                var navwidth = scrCont.find('ul');
                                                navwidth.scrollLeft(navwidth.scrollLeft() + 200);
                                            }
                                        )
                                )
                                .append(
                                    $('<ul>')
                                );

                            if (val.message.attachment.payload.template_type === "list") {
                                scrCont.addClass('list');
                            }

                            scrCont.appendTo(container);


                            val.message.attachment.payload.elements.forEach(function (item) {
                                var generic = $('<li>').addClass('generic');

                                if (item.image_url) {
                                    generic.append(
                                        $('<div>')
                                            .addClass('generic-img')
                                            .append(
                                                $('<div>')
                                                    .addClass('inner')
                                                    .css('background-image', 'url("' + item.image_url + '")')
                                            )
                                    )
                                }

                                if (item.title || item.subtitle) {
                                    var info = $('<div>')
                                        .addClass('generic-info')
                                        .appendTo(generic)
                                }

                                if (item.title) {
                                    $('<p>')
                                        .addClass('title')
                                        .text(item.title)
                                        .appendTo(info)
                                }
                                if (item.subtitle) {
                                    $('<p>')
                                        .addClass('subtitle')
                                        .text(item.subtitle)
                                        .appendTo(info)
                                }

                                if (item.buttons) {

                                    item.buttons.forEach(function (entry) {
                                        var btn = $('<a>')
                                            .addClass('generic-btn')
                                            .text(entry.title);

                                        if (entry.type === "postback") {
                                            btn
                                                .attr('payload', entry.payload)
                                                .click(function () {
                                                    send("btn", $(this));
                                                });
                                        } else if (entry.type === "web_url") {
                                            btn
                                                .attr('href', entry.url)
                                                .attr('target', '_blank')
                                        }

                                        btn.appendTo(generic);

                                    })

                                }

                                generic.appendTo(scrCont.find('ul'));
                            });

                            scrCont.find('ul').find('li').each(function () {
                                scrContWidth += parseInt($(this).css('width'), 10) + 10;
                            });

                            if (scrContWidth > parseInt(scrCont.css('width'), 10)) {
                                scrCont.addClass('scrollable');
                            }
                            setGenericWidth();

                        }

                        if (val.message.attachment && val.message.attachment.payload.buttons) {
                            message.css('border-radius', '10px 10px 0 0');
                            btnWidth = message.outerWidth();

                            val.message.attachment.payload.buttons.forEach(function (entry) {

                                var btn = $('<a class="chat-message button">').text(entry.title);
                                if (btnWidth !== 0) {
                                    btn.css('width', btnWidth);

                                } else if ($('.scrolling-container.list') && !btnWidth) {
                                    btnWidth = parseInt($('.scrolling-container.list').css('width'), 10);
                                    btn
                                        .css('max-width', '100%')
                                        .css('margin', '0')
                                        .css('width', btnWidth - 10);
                                } else {
                                    btn.css('display', 'inline-block');
                                }
                                if (entry.type === "postback") {
                                    btn
                                        .attr('payload', entry.payload)
                                        .click(function () {
                                            send("btn", $(this));
                                        });
                                } else if (entry.type === "web_url") {
                                    btn
                                        .attr('href', entry.url)
                                        .attr('target', '_blank')
                                }

                                btn.appendTo(container)

                            });
                        }

                    }, 333);
                }

                container.prependTo($('#chat-window').find('.message-container'));
                chatScrollBottom();

            }

            var stompClient = null;

            function connect() {
                // var socket = new SockJS('https://010e8e35.ngrok.io/web');
                var socket = new SockJS('https://pavlenko.botscrew.com/ailira/web');
                stompClient = Stomp.over(socket);
                stompClient.connect({}, function (frame) {
                    // setConnected(true);
                    console.log('Connected: ' + frame);
                    stompClient.subscribe('/topic/greetings/' + chatId, function (greeting) {
                        console.log(greeting);
                        showGreeting(JSON.parse(greeting.body));
                    });
                    sendName("hi");
                });
            }

            function disconnect() {
                if (stompClient != null) {
                    stompClient.disconnect();
                }
                console.log("Disconnected");
            }

            function sendName(message, param, echo) {

                var data = {
                    object: "page",
                    entry: [
                        {
                            id: "555",
                            time: 1458692752478,
                            messaging: [
                                {
                                    sender: {
                                        id: chatId
                                    },
                                    recipient: {
                                        id: "567"
                                    },
                                    message: null
                                }

                            ]
                        }
                    ]
                };

                if (param === "btn") {
                    data.entry[0].messaging[0].postback = {
                        payload: message
                    }
                } else {
                    data.entry[0].messaging[0].message = {
                        text: message
                    }
                }

                if(echo) {
                    data.entry[0].messaging[0].message.is_echo = true;
                }

                stompClient.send("/app/hello", {}, JSON.stringify(data));
            }

            function showGreeting(message) {
                setResponse(message);
            }

            var chatId = null,
                accessToken = null;

            $(window).load(function () {
                console.log('window loaded');

                FB.getLoginStatus(function (response) {
                    console.log(response);

                    if (response.status === 'connected') {
                        console.log('Logged in FB.');
                        FB.api('/me', function (response) {
                            chatId = response.id;
                            accessToken = FB.getAuthResponse()['accessToken'];
                            chatInit(chatId, accessToken);
                        });
                        // FB.logout(function(response) {
                        //     console.log('logged out');
                        // });
                    }

                });

                // gapi.load('client', initClient);
            });

            function loginFB() {

                FB.getLoginStatus(function (response) {

                    if (response.status === 'connected') {
                        console.log('Already logged in FB.');
                    } else {
                        FB.login(function () {
                            FB.api('/me', function (response) {
                                chatId = response.id;
                                if (response.authResponse) {
                                    accessToken = FB.getAuthResponse()['accessToken'];
                                }

                                if(chatId && (chatId !== undefined)) {
                                    console.log('You are successfully logged in FB.');
                                    chatInit(chatId, accessToken);
                                }
                            });
                        });
                    }

                })
            }


            // function initClient() {
            //     // Initialize the client with API key and People API, and initialize OAuth with an
            //     // OAuth 2.0 client ID and scopes (space delimited string) to request access.
            //     gapi.client.init({
            //         apiKey: 'AIzaSyBxI_qitnT0piafxGBgnQ_c6AfcRJeJ41E',
            //         discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
            //         clientId: 'http://314496251274-l1emjpbm5p1o4l0ap7gh4f9k3fi4iupa.apps.googleusercontent.com/',
            //         scope: 'profile'
            //     }).then(function () {
            //         // Listen for sign-in state changes.
            //         gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            //
            //         // Handle the initial sign-in state.
            //         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            //     });
            // }
            //
            // function updateSigninStatus(isSignedIn) {
            //     // When signin status changes, this function is called.
            //     // If the signin status is changed to signedIn, we make an API call.
            //     if (isSignedIn) {
            //         makeApiCall();
            //     }
            // }
            //
            // function handleSignInClick(event) {
            //     // Ideally the button should only show up after gapi.client.init finishes, so that this
            //     // handler won't be called before OAuth is initialized.
            //     gapi.auth2.getAuthInstance().signIn();
            // }
            //
            // function handleSignOutClick(event) {
            //     gapi.auth2.getAuthInstance().signOut();
            // }
            //
            // function makeApiCall() {
            //     // Make an API call to the People API, and print the user's given name.
            //     gapi.client.people.people.get({
            //         'resourceName': 'people/me',
            //         'requestMask.includeField': 'person.names'
            //     }).then(function(response) {
            //         console.log('Hello, ' + response.result.names[0].givenName);
            //     }, function(reason) {
            //         console.log('Error: ' + reason.result.error.message);
            //     });
            // }
            //
            function chatInit(id, token) {

                $($('.start-screen')[0]).fadeOut("fast", function () {
                    var data = {
                        id: id,
                        token: token
                    };
                    $.ajax({
                        type: "POST",
                        // type: "GET",            //mocked up version, should be post with data: !!!
                        // url: 'https://010e8e35.ngrok.io/web/getStarted',
                        url: 'https://pavlenko.botscrew.com/ailira/web/getStarted',
                        // url: './data/response.json',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(data),

                        success: function (id) {
                            // setResponse(id);
                            connect();
                        },
                        error: function () {
                            console.log("Internal Server Error. Not possible to get chat id.");
                        }
                    });
                });

            }

            function send(param, elem) {

                if (!$('.send-message').is('.disabled')) {

                    var text = $("#chatInput").val();

                    if (param === "btn") {
                        text = elem.text();
                    }

                    if (text.length && text.trim()) {

                        $("#chatInput").val('');
                        if (param === "btn") {
                            sendName(elem.attr('payload'), "btn");
                        } else {
                            sendName(text);
                        }

                        var message = $('<div class="chat-message user">');

                        $('<div class="message-outer user">')
                            .prependTo($('#chat-window')
                                .find('.message-container'));

                        message
                            .text(text)
                            .appendTo(
                                $('#chat-window').find('.message-container').find('.message-outer.user')[0]
                            );

                    } else {
                        $("#chatInput").val('').focus();
                    }
                    chatScrollBottom();

                }

            }

            function chatScrollBottom() {
                $(".message-container").animate({scrollTop: $('.message-container').prop("scrollHeight")}, 0);
            }

            function getVisible($el, param) {
                if ($el.length) {
                    var scrollTop = $(this).scrollTop() + navHeight;

                    if (param) {
                        scrollTop = $(this).scrollTop();
                    }

                    var scrollBot = scrollTop + $(this).height(),
                        elTop = $el.offset().top,
                        elBottom = elTop + $el.outerHeight(),
                        visibleTop = elTop < scrollTop ? scrollTop : elTop,
                        visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
                    return visibleBottom - visibleTop;
                }
            }

            function setChatSize() {
                var slideVisible = getVisible($('.slide-1')) > 0 ? getVisible($('.slide-1')) : 0;
                var footerVisible = getVisible($('#footer'), 1) > 0 ? getVisible($('#footer'), 1) : 0;
                var chatHeight = $(window).height() - navHeight - footerVisible - slideVisible,
                    chatWidth = $('.chat-container').css('width');

                $('#chat-window')
                    .stop()
                    .css('height', chatHeight)
                    .css('bottom', footerVisible)
                    .animate({
                        'width': chatWidth
                    }, 300);
            }

            function setGenericWidth() {

                genericScrollValue = parseInt($('.chat-container').css('width'), 10);
                var genInfo = $('.generic-info');
                if (genInfo && !genInfo.parent().parent().parent().hasClass('list')) {
                    var scrContWidth = genInfo.parent().parent().css('width');
                    var scrCont = genInfo.parent().parent();
                    scrCont.find('.generic-info').each(function () {
                        $(this).css('width', scrContWidth);
                        var genImg = $(this).parent().find('.generic-img');

                        if (genImg) {
                            var genImgWidth = parseInt($(this).parent().find('.generic-img').find('.inner').css('width'), 10);
                            genImg.find('.inner').css('height', genImgWidth / 2);
                        }
                    });

                    scrCont.parent().find('.arrow').first().click(
                        function () {
                            var navwidth = scrCont.find('ul');
                            navwidth.scrollLeft(navwidth.scrollLeft() - parseInt(scrContWidth, 10));
                        }
                    );
                    scrCont.parent().find('.arrow').last().click(
                        function () {
                            var navwidth = scrCont.find('ul');
                            navwidth.scrollLeft(navwidth.scrollLeft() + parseInt(scrContWidth, 10));
                        }
                    );

                }
            }

            // $(window).unload(function () {
            //     disconnect();
            // });

            $(window)
                .on('scroll resize', function () {
                    getVisible($('.slide-1'));
                    setChatSize();
                })
                .on('resize', function () {
                    setGenericWidth();
                });

            $.fn.isolatedScroll = function () {
                this.bind('mousewheel DOMMouseScroll', function (e) {
                    var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
                        bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
                        topOverflow = this.scrollTop <= 0;

                    if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
                        e.preventDefault();
                    }
                });
                return this;
            };

            $('.message-container').isolatedScroll();

            setChatSize();

            window.initializeShopchat = init;
            return true;
        }

        init();
    })();

});

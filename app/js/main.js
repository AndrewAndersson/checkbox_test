$('.comment__comment-menu').bind('click', function() {
    $('.active').removeClass('not-active');
    $('.comment__comment-menu').addClass('not-active');
    $('.addcomment').removeClass('not-active');
});
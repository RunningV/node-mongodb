$(function() {
	$('.del').click(function(e) {
		var target = $(e.target),
			id = target.data('id'),
			tr = $('.item-id-' + id);
		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id=' + id
		}).done(function(res) {
			if(res.success === 1 && tr.length > 0) tr.remove();
			history.go(0);
		})
	})
})
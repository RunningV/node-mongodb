$(function() {
	$('.del').click(function(e) {
		var target = $(e.target),
			id = target.data('id'),
			tr = $('.item-id-' + id);
		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/delete?id=' + id
		}).done(function(res) {
			if(res.success === 1 && tr.length > 0) tr.remove();
			history.go(0);
		})
	})

	$('#douban').blur(function() {
		var douban = $(this);
		var id = douban.val();
		if(id) {
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data) {
					console.log(data);
					$('#inputTitle').val(data.title);
					$('#inputCates').val(data.genres[0]);
					$('#inputDoctor').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0]);
					//$('#inputLang').val(data.language);
					$('#inputYear').val(data.year);
					$('#inputPoster').val(data.images.large);
					$('#inputFlash').val(data.images.large);
					$('#inputSummary').val(data.summary);
				}
			})
		}
	})
})
$(function() {
	$('.comment').click(function() {
		var target = $(this),
			tid = target.data('tid'),//被评论人id
			cid = target.data('cid');//评论人id
		console.log(target);
		
		/*
		*判断是否存在#id存储标签？将被评论人id存入 :
		*插入新的input#tid标签存入被评论人
		*cid逻辑雷同
		*/
		if($('#tid').length) $('#tid').val(tid);
		else{
			$('<input>').attr({
				type: 'hidden',
				id: 'tid',
				name: 'comment[tid]',
				value: tid
			}).appendTo('#commentForm');
		}
		
		if($('#cid').length) $('#cid').val(cid);
		else{
			$('<input>').attr({
				type: 'hidden',
				id: 'cid',
				name: 'comment[cid]',
				value: cid
			}).appendTo('#commentForm')
		}	
	})
})
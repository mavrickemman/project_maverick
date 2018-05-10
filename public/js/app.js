function moveHeading () { 
	$("#intro").velocity ( { translateY: 0 }, [ 400, 30 ], 1800 );
}

function slideInItems () {
	$(".highlight").velocity ( { translateY: 0 }, [ 400, 30], 1800 );
	
	$(".slide-in").velocity ( "transition.slideUpIn", { stagger: 80, drag: !0 } );
}

$("#intro").velocity ( { 
	translateY: ( $(window).outerHeight() - $("#intro").height() ) / 2 ,
	opacity: 1 
	}, 0 
);

$(".highlight").velocity ({
	translateY: $(window).height()
	}, 0
);

$("#intro").blast({ 
	delimiter:"character"
}).velocity("transition.slideUpIn", { 
	display: null,
	stagger: 25, 
	duration: 600,
	complete: function () {
		setTimeout(moveHeading, 10);
		setTimeout(slideInItems, 10);
	}
});
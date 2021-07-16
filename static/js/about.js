//Team Slider


$( document ).ready(function() {
    console.log( "ready!" );
	$('#customers-teams').owlCarousel({
		loop: true,
		center: true,
		items: 3,
		margin: 0,
		autoplay: true,
		dots:true,
		autoplayTimeout: 4500,
		checkVisibility: true,
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 2
			},
			1170: {
				items: 3
			}
		}
	});
});
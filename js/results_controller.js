function ResultsController($scope){

	$scope.results = ["Wow", "Such Design", "Many Results", "Very Impressive", "Eric", "Nayeon", "Eugene", "Noj"];

	$scope.options = {
		rooms : ["Living Room", "Kitchen", "Bedroom", "Bathroom"],
		colors : ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Brown", "Gray", "Black", "White"],
		styles : ["Antique", "Country", "Modern", "Basic"],
	};

	$scope.filters = {
		room : "",
		colors : [],
		styles : [],
		budget : {
			min : 0,
			max : 5000,
		},
	};

	$scope.newSearch = function(){
		// TODO - Update this.results
		alert("HEY");
	}

	// Model-View Handler
	$(document).ready(function(){

		// Budget Slider Widget
		$("#budget_slider").slider({
			range: true,
			min: 0,
			max: 5000,
			values: [0, 5000],
			// Update Budget
			stop: function( event, ui ) {
				var min = ui.values[0];
				var max = ui.values[1];
				if (ui.value == min){
					// Update Min
					$scope.filters.budget.min = min;
				} else {
					// Update Max
					$scope.filters.budget.max = max;
				}
			}
		});
		
		// Update Room
		$(".filter-room select").on("change", function(event){
			var index = $(".search-filter option:selected").val();
			var room = $scope.options.rooms[index];
			$scope.filters.room = room;
		});

		// Update Colors
		$(".color_option").on("click", function(event){
			var color = $(this).attr("value");
			var checked = $(this).attr("checked");
			if (checked){
				// Disable and Remove from Filters
				$(this).attr("checked", false);
				$(this).css({border : "solid black 1px"})
				var index = $scope.filters.colors.indexOf(color);
				if (index > -1){
					$scope.filters.colors.splice(index, 1);
				}
			} else {
				// Enable and Add to Filters
				$(this).attr("checked", true);
				$(this).css({border : "solid blue 1px"})
				$scope.filters.colors.push(color);
			}
		});

		// Update Styles
		$(".style_option").on("click", function(event){
			var style = $(this).attr("value");
			var checked = $(this).attr("checked");
			if (checked){
				// Disable and Remove from Filters
				$(this).attr("checked", false);
				$(this).css({border : "solid black 1px"})
				var index = $scope.filters.styles.indexOf(style);
				if (index > -1){
					$scope.filters.styles.splice(index, 1);
				}
			} else {
				// Enable and Add to Filters
				$(this).attr("checked", true);
				$(this).css({border : "solid blue 1px"})
				$scope.filters.styles.push(style);
			}
		});

	});

}
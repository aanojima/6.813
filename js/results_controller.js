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

	$scope.applyFilters = function(data){
		delete $scope.results;
		$scope.results = [];
		for (var id in data){
			if (!data[id]){
				break;
			}
			var result = data[id];
			if (result.filters.room != $scope.filters.rooms){
				continue;
			}
			if (result.filters.price < $scope.filters.budget.min ||
				result.filters.price > $scope.filters.budget.max){
				continue;
			}
			// matching style
			var styleNotFound = true;
			for (var i in result.filters.styles){
				var style = result.filters.styles[i];
				var index = $scope.filters.styles.indexOf(style);
				if (index > -1){
					styleMatch = true;
					break;
				}
			}
			if (!styleNotFound){
				continue;
			}
			// matching color
			var colorNotFound = true;
			for (var i in result.filters.colors){
				var color = result.filters.colors[i];
				var index = $scope.filters.colors.indexOf(color);
				if (index > -1){
					colorNotFound = false;
					break;
				}
			}
			if (!colorNotFound){
				continue;
			}
			$scope.results.push(result);
		}
	}

	// For the luls
	var deployTheAlgorithm = function(data){
		$scope.applyFilters(data);
	}

	$scope.newSearch = function(){
		var results;

		$.ajax({
			method : "POST",
			url : "data.json", // TODO
			success : deployTheAlgorithm,
			error : function(error){
				console.log("XMLHttpRequest Error");
			}
		});
	}

	// Model-View Handler
	$(document).ready(function(){

		getUrlVars = function() {
			var vars = [], hash;
			var hashes = window.location.href.slice(
					window.location.href.indexOf('?') + 1).split('&');
			for ( var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		};

		getUrlVar = function(name) {
			return getUrlVars()[name];
		};

		passUrlVar = function(id) {
			var query = '?id=' + String(id);
			window.location.href = window.location.protocol + '://' + 
				window.location.host + 
				'result' + 
				query;
		}

		// Search by URL Query
		var args = getUrlVars();
		if (args.r){
			$scope.filters.room = args.r.replace('_', ' ');
		}
		if (args.c){
			var color_array = args.c.split(',');
			for (var i in color_array){
				color_array[i] = color_array[i].replace('_', ' ');
			}
			$scope.filters.colors = color_array;
		}
		if (args.s){
			var style_array = args.s.split(',');
			for (var i in style_array){
				style_array[i] = style_array[i].replace('_', ' ');
			}
			$scope.filters.styles = style_array;
		}
		if (args.bmin){
			var bmin = parseInt(args.bmin);
			if (bmin >= 0 && bmin <= 5000){
				$scope.filters.budget.min = bmin;
			}
		}
		if (args.bmax){
			var bmax = parseInt(args.bmax);
			if (bmax >= 0 && bmax <= 5000){
				$scope.filters.budget.max = bmax;
			}
		}

		// Update Room Filter View
		$(".filter-room select").val($scope.filters.room);

		// Update Color Filter View
		for (var i in args.c){
			var color = $scope.filters.colors[i];
			$(".color_option[value='"+color+"']").attr("checked", true);
			if (color == "Black"){
				$(".color_option[value='"+color+"']").css({border : "solid gray 2px"});
			} else {
				$(".color_option[value='"+color+"']").css({border : "solid 2px"});	
			}
		}

		// Update Style Filter View
		for (var i in args.s){
			var style = $scope.filters.styles[i];
			$(".style_option[value='"+style+"']").attr("checked", true);
			$(".style_option[value='"+style+"']").css({border : "solid 2px"});
		}

		// Create Budget Slider View
		$("#budget_slider").slider({
			range: true,
			min: 0,
			max: 5000,
			values: [$scope.filters.budget.min, $scope.filters.budget.max],
			// Update Budget on Change
			slide : function( event, ui ) {
				var min = ui.values[0];
				var max = ui.values[1];
				if (ui.value == min){
					// Update Min
					$scope.filters.budget.min = min;
					$("#min-budget").text("Min: " + String(min));
				} else {
					// Update Max
					$scope.filters.budget.max = max;
					$("#max-budget").text("Max: " + String(max));
				}
			},
			stop: function( event, ui ) {
				var min = ui.values[0];
				var max = ui.values[1];
				if (ui.value == min){
					// Update Min
					$scope.filters.budget.min = min;
					$("#min-budget").text("Min: " + String(min));
				} else {
					// Update Max
					$scope.filters.budget.max = max;
					$("#max-budget").text("Max: " + String(max));
				}
				$scope.newSearch();
			}
		});

		// Update Budget Slider View
		$("#min-budget").text("Min: " + String($scope.filters.budget.min));
		$("#max-budget").text("Max: " + String($scope.filters.budget.max));
		
		// Update Room on Change
		$(".filter-room select").on("change", function(event){
			var room = $(".search-filter option:selected").val();
			$scope.filters.room = room;
			$scope.newSearch();
		});

		// Update Colors on Change
		$(".color_option").on("click", function(event){
			var color = $(this).attr("value");
			var checked = $(this).attr("checked");
			if (checked){
				// Disable and Remove from Filters
				$(this).attr("checked", false);
				if (color == "Black"){
					$(this).css({border : "dotted gray 2px"});
				} else {
					$(this).css({border : "dotted 2px"});
				}
				var index = $scope.filters.colors.indexOf(color);
				if (index > -1){
					$scope.filters.colors.splice(index, 1);
				}
			} else {
				// Enable and Add to Filters
				$(this).attr("checked", true);
				if (color == "Black"){
					$(this).css({border : "solid gray 2px"});
				} else {
					$(this).css({border : "solid 2px"});
				}
				$scope.filters.colors.push(color);
			}
			$scope.newSearch();
		});

		// Update Styles on Change
		$(".style_option").on("click", function(event){
			var style = $(this).attr("value");
			var checked = $(this).attr("checked");
			if (checked){
				// Disable and Remove from Filters
				$(this).attr("checked", false);
				$(this).css({border : "dotted 2px"})
				var index = $scope.filters.styles.indexOf(style);
				if (index > -1){
					$scope.filters.styles.splice(index, 1);
				}
			} else {
				// Enable and Add to Filters
				$(this).attr("checked", true);
				$(this).css({border : "solid 2px"})
				$scope.filters.styles.push(style);
			}
		});
		$scope.newSearch();
	});

}
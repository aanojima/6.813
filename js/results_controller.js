function ResultsController($scope){

	// $scope.results = ["Wow", "Such Design", "Many Results", "Very Impressive", "Eric", "Nayeon", "Eugene", "Noj"];
	$scope.results = window.data;

	$scope.options = {
		rooms : ["Living Room", "Kitchen", "Bedroom", "Bathroom"],
		colors : ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Brown", "Gray", "Black", "White", "MintCream"],
		styles : ["Antique", "Rustic", "Modern", "Retro", "Romantic", "Simple", "Luxury", "Industrial"],
	};

	$scope.filters = {
		room : "Any",
		colors : [],
		styles : [],
		budget : {
			min : 0,
			max : 5000,
		},
	};

	// TODO for filters with nothing selected
	$scope.applyFilters = function(data){
		$scope.results = {};
		for (var id in data){
			if (!data[id]){
				break;
			}
			var result = data[id];
			if ($scope.filters.room &&
				$scope.filters.room != "Any" && 
				result.filters.room != $scope.filters.room){
				continue;
			}
			if (result.filters.price < $scope.filters.budget.min ||
				result.filters.price > $scope.filters.budget.max){
				continue;
			}
			// matching style
			var styleMatch = false;
			for (var i in $scope.filters.styles){
				var style = $scope.filters.styles[i];
				var index = result.filters.styles.indexOf(style);
				if (index > -1){
					styleMatch = true;
				} else {
					styleMatch = false;
					break;
				}
			}
			if ($scope.filters.styles.length > 0 && !styleMatch){
				continue;
			}
			// matching color
			var colorMatch = false;
			for (var i in $scope.filters.colors){
				var color = $scope.filters.colors[i];
				var index = result.filters.colors.indexOf(color);
				if (index > -1){
					colorMatch = true;
				} else {
					colorMatch = false;
					break;
				}
			}
			if ($scope.filters.colors.length > 0 && !colorMatch){
				continue;
			}

			$scope.results[id] = result;
		}
		$scope.updateResultsView();
	}

	$scope.updateResultsView = function(){
		var result_grid = $(".result_grid")[0];
		result_grid.innerHTML = "";
		for (var id in $scope.results){
			var result = $scope.results[id];
			var link = document.createElement('a');
			link.href = "result.html?id=" + id;
			var div = document.createElement('div');
			div.className = "result";
			var text = document.createElement('b');
			text.innerHTML = result.information.name;
			var img = document.createElement('img');
			img.src = result.information.image;
			result_grid.appendChild(link);
			link.appendChild(div);
			div.appendChild(text);
			div.appendChild(img);
		}
	}

	// For the luls
	var deployTheAlgorithm = function(data){
		$scope.applyFilters(data);
	}

	var deployDummyAlgorithm = function(){
		$scope.applyFilters(window.data);
	}

	$scope.newSearch = function(){
		$.ajax({
			method : "POST",
			url : "js/data.json", // TODO
			success : deployTheAlgorithm,
			error : deployDummyAlgorithm,
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
			window.location.href = 'result.html' + query;
		}

		// Mint Cream
		$("#MintCream_color").text("Cream");

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
		$scope.applyFilters($scope.results);

		$(".filter-room select").val($scope.filters.room);	

		// Update Color Filter View
		for (var i in args.c){
			var color = $scope.filters.colors[i];
			$(".color_option[value='"+color+"']").attr("checked", true);
			if (color == "Black"){
				// $(".color_option[value='"+color+"']").css({border : "solid gray 2px"});
				$(".color_option[value='"+color+"']").html(color+"<br><img src='images/white-check.png'/>");
			} else {
				// $(".color_option[value='"+color+"']").css({border : "solid 2px"});
				$(".color_option[value='"+color+"']").html(color+"<br><img src='images/black-check.png'/>");
			}
			$(".color_option[value='"+color+"']").addClass("filter_option_selected");
		}

		// Update Style Filter View
		for (var i in args.s){
			var style = $scope.filters.styles[i];
			$(".style_option[value='"+style+"']").attr("checked", true);
			// $(".style_option[value='"+style+"']").css({border : "solid 2px"});
			$(".style_option[value='"+style+"']").html(style+"<br><img src='images/black-check.png'/>");
			$(".style_option[value='"+style+"']").addClass("filter_option_selected");
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
					// $(this).css({border : "dotted gray 2px"});
				} else {
					// $(this).css({border : "dotted 2px"});
				}
				$(this).html(color+"<br>");
				$(this).removeClass("filter_option_selected");
				var index = $scope.filters.colors.indexOf(color);
				if (index > -1){
					$scope.filters.colors.splice(index, 1);
				}
			} else {
				// Enable and Add to Filters
				$(this).attr("checked", true);
				if (color == "Black"){
					// $(this).css({border : "solid gray 2px"});
					$(this).html(color+"<br><img src='images/white-check.png'/>");
				} else {
					// $(this).css({border : "solid 2px"});
					$(this).html(color+"<br><img src='images/black-check.png'/>");
				}
				$(this).addClass("filter_option_selected");
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
				// $(this).css({border : "dotted 2px"})
				var index = $scope.filters.styles.indexOf(style);
				if (index > -1){
					$scope.filters.styles.splice(index, 1);
				}
				$(this).html(style+"<br>");
				$(this).removeClass("filter_option_selected");
			} else {
				// Enable and Add to Filters
				$(this).attr("checked", true);
				// $(this).css({border : "solid 2px"})
				$scope.filters.styles.push(style);
				$(this).html(style+"<br><img src='images/black-check.png'/>");
				$(this).addClass("filter_option_selected");
			}
			$scope.newSearch();
		});
		
	});

}
$(function() {
	function GCodePreviewViewModel(parameters) {
		var self = this;

		self.filesViewModel = parameters[0];
		self.current_file = ko.observable();
		self.current_file_url = ko.observable();
		self.downloading = ko.observable(false);
		self.container = document.getElementById( 'gcode_thumbnail' );
		self.camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 10000 ); 
		self.scene = new THREE.Scene(); 
		self.renderer = new THREE.WebGLRenderer();
		self.loader = new THREE.GCodeLoader();

		self.camera.position.set( 0, 0, 70 );
		self.renderer.setPixelRatio( window.devicePixelRatio );
		self.renderer.setSize( 600, 600 );

		self.filesViewModel.load_preview = function(data){
			self.current_file(data.name);
			self.current_file_url(data.refs.download);
			self.downloading(true);
			$('div#thumbnail_viewer').modal('show');
		}

		self.resize = function() {
			self.camera.aspect = self.container.innerWidth / self.container.innerHeight;
			self.camera.updateProjectionMatrix();
			self.renderer.setSize( self.container.innerWidth, self.container.innerHeight );
		}

		self.animate = function() {
			self.renderer.render( self.scene, self.camera );
			requestAnimationFrame( self.animate );
		}

		$(document).ready(function(){
			let regex = /<div class="btn-group action-buttons">([\s\S]*)<.div>/mi;
			let template = '<div class="btn btn-mini" data-bind="click: function() { if ($root.loginState.isUser()) { $root.load_preview($data) } else { return; } }" title="Show Thumbnail"><i class="fa fa-image"></i></div>';

			$("#files_template_machinecode").text(function () {
				return $(this).text().replace(regex, '<div class="btn-group action-buttons">$1	' + template + '></div>');
			});

			$('div#thumbnail_viewer').on('shown.bs.modal', function(){
				console.log(self.container);
				self.loader.load( self.current_file_url(), function ( object ) {
					object.position.set( - 100, - 20, 100 );
					self.scene.add( object );
					self.downloading(false);
				} );

				self.container.appendChild( self.renderer.domElement );
				self.controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
				//window.addEventListener( 'resize', self.resize, false );
				self.animate();
			});
		});
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: GCodePreviewViewModel, 
		dependencies: ["filesViewModel"], 
		elements: ["div#thumbnail_viewer"]
	  });
});

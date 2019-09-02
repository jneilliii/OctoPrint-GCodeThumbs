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
		self.renderer = new THREE.WebGLRenderer({canvas:self.container, alpha: true});
		self.loader = new THREE.GCodeLoader();
		self.loader.splitLayer = true;
		self.loader.includeMovement = false;
		self.controls = new THREE.OrbitControls( self.camera, self.container );
		self.renderer.setPixelRatio( window.devicePixelRatio );
		self.renderer.setSize( 600, 600 );

		self.filesViewModel.load_preview = function(data){
			$('div#thumbnail_viewer').modal('show');
			self.current_file(data.name);
			self.current_file_url(data.refs.download);
			self.downloading(true);
			self.loader.load( data.refs.download, function ( object ) {
				self.scene.remove.apply(self.scene, self.scene.children);

				self.bed = new THREE.GridHelper(300, 30); // replace with bed dimensions.
				self.scene.add(self.bed);

				self.camera.position.x = 0;
				self.camera.position.y = 50;
				self.camera.position.z = 300;
				self.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

				object.position.set( - 150, 0, 150 ); // replace with bed dimensions/2
				self.scene.add( object );

				self.animate();
				self.downloading(false);
			}/* , function( progress ){console.log((progress.loaded/progress.total));} */);
		}

		self.render = function(){
			self.renderer.render( self.scene, self.camera );
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
			
			$('div#thumbnail_viewer').on('hidden.bs.modal', function(){
				console.log('clearing scene');
				self.scene.remove.apply(self.scene, self.scene.children);
			});
		});
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: GCodePreviewViewModel, 
		dependencies: ["filesViewModel"], 
		elements: ["div#thumbnail_viewer"]
	  });
});

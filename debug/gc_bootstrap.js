
function start_plugin()
{
    plugin = new SLV.Plugin('slv', true);

    plugin.load(options, function(error) {
        if (!error) {
            plugin.initialize(undefined, function(error) {
                if (!error) {
                    plugin.mapControl = new SLV.Control.WebGLMapControl(this.id + '-map', undefined, map).initialize();
                    // plugin.mapControl.deviceManager.loadDevices(10000);
                } else {
                    console.log(error);
                }
            });
        }
    });
}

function loadDependency(path) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');

        script.type = 'text/javascript';

        script.onload = function() {
            resolve();
        }
        script.src = gc_path + path;

        document.head.appendChild(script);
    });
}

function loadDependencies() {
    var deps = [
        'js/slv.plugin.js',
        'js/lib/rbush/rbush.min.js',
        'js/lib/bluebird/bluebird.min.js',
        'src/slv.controls/map/webgl/SLV.Control.WebGLMapControl.js',
        'src/slv.controls/map/webgl/SLV.Control.WebGLMapControl.DeviceManager.js'
    ];
    var requests = [];

    for(var i=0; i<deps.length;i++) {
        requests.push(loadDependency(deps[i]));
    }

    Promise.all(requests).then(function(responses) {
        start_plugin();
    });
}
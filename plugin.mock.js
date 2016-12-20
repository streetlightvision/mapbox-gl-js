'use strict';
var SLV = {};
SLV.Model = {};
SLV.Model.Equipment = {};
SLV.Model.Equipment.Type = {};

SLV.Plugin = function () {
    this.userContext = {
        serviceAddress: {
            protocol: 'http:',
            host: 'localhost',
            port: '8080',
            path: 'reports/'
        }
    };
};

SLV.Model.Equipment.Type.DEFAULT = 'device';
SLV.Model.Equipment.Type.STREETLIGHT = 'streetlight';
SLV.Model.Equipment.Type.SWITCH = 'switch';
SLV.Model.Equipment.Type.CAMERA = 'cameraip';
SLV.Model.Equipment.Type.CONTROLLER = 'controllerdevice';
SLV.Model.Equipment.Type.ELECTRICALCOUNTER = 'electricalCounter';
SLV.Model.Equipment.Type.VEHICLECHARGINGSTATION = 'vehicleChargingStation';
SLV.Model.Equipment.Type.ENVIRONMENTALSENSOR = 'envSensor';
SLV.Model.Equipment.Type.INPUT = 'input';
SLV.Model.Equipment.Type.OUTPUT = 'output';
SLV.Model.Equipment.Type.NATURE = 'nature';
SLV.Model.Equipment.Type.TANK = 'tank';
SLV.Model.Equipment.Type.CITYOBJECT = 'cityObject';
SLV.Model.Equipment.Type.TRANSPORTSIGNAGE = 'transportSignage';
SLV.Model.Equipment.Type.BUILDING = 'building';
SLV.Model.Equipment.Type.AUDIOPLAYER = 'audioPlayer';
SLV.Model.Equipment.Type.WEATHERSTATION = 'weatherStation';
SLV.Model.Equipment.Type.OCCUPANCYSENSOR = 'occupancySensor';
SLV.Model.Equipment.Type.WASTECONTAINER = 'wasteContainer';
SLV.Model.Equipment.Type.PARKINGPLACE = 'parkingPlace';
SLV.Model.Equipment.Type.NETWORKCOMPONENT = 'networkComponent';
SLV.Model.Equipment.Type.VEHICLE = 'vehicle';

SLV.Model.Equipment.Type.DEFAULT_ID = 0;
SLV.Model.Equipment.Type.STREETLIGHT_ID = 1;
SLV.Model.Equipment.Type.SWITCH_ID = 32;
SLV.Model.Equipment.Type.CAMERA_ID = 4;
SLV.Model.Equipment.Type.CONTROLLER_ID = 8;
SLV.Model.Equipment.Type.ELECTRICALCOUNTER_ID = 16;
SLV.Model.Equipment.Type.VEHICLECHARGINGSTATION_ID = 64;
// SLV.Model.Equipment.Type.ENVIRONMENTALSENSOR_ID = 'envSensor'; // missing in categories.xml
SLV.Model.Equipment.Type.INPUT_ID = 10001;
SLV.Model.Equipment.Type.OUTPUT_ID = 10002;
SLV.Model.Equipment.Type.NATURE_ID = 256;
SLV.Model.Equipment.Type.TANK_ID = 131073;
SLV.Model.Equipment.Type.CITYOBJECT_ID = 512;
SLV.Model.Equipment.Type.TRANSPORTSIGNAGE_ID = 1024;
SLV.Model.Equipment.Type.BUILDING_ID = 2048;
SLV.Model.Equipment.Type.AUDIOPLAYER_ID = 4096;
// SLV.Model.Equipment.Type.WEATHERSTATION_ID = 'weatherStation'; // missing in categories.xml
SLV.Model.Equipment.Type.OCCUPANCYSENSOR_ID = 131072;
SLV.Model.Equipment.Type.WASTECONTAINER_ID = 16384;
SLV.Model.Equipment.Type.PARKINGPLACE_ID = 32768;
SLV.Model.Equipment.Type.NETWORKCOMPONENT_ID = 65536;
SLV.Model.Equipment.Type.VEHICLE_ID = 10003;
